import {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {
  appendImages,
  clearImages,
  setHasMore,
  setPage,
} from '../redux/slices/imagesSlice';
import type {AppDispatch, RootState} from '../redux/store';
import {fetchPicsumImages} from '../services/imagesApi';
import {useNetwork} from './useNetwork';

const PAGE_SIZE = 20;

type FetchMode = 'initial' | 'refresh' | 'more';

export function useImagePagination() {
  const dispatch = useDispatch<AppDispatch>();
  const {isConnected} = useNetwork();
  const {items, hasMore, page} = useSelector((s: RootState) => s.images);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchPage = useCallback(
    async (nextPage: number, mode: FetchMode) => {
      if (inFlightRef.current) return false;
      if (!isConnected) {
        setErrorMessage('No internet connection. Please check your network.');
        return false;
      }

      inFlightRef.current = true;
      if (mode === 'initial' || mode === 'refresh') {
        setLoading(true);
      }

      try {
        setErrorMessage(null);
        if (mode === 'initial' || mode === 'refresh') {
          dispatch(clearImages());
        }

        const data = await fetchPicsumImages({
          page: nextPage,
          limit: PAGE_SIZE,
        });
        dispatch(appendImages(data));
        dispatch(setPage(nextPage));
        dispatch(setHasMore(data.length === PAGE_SIZE));
        return true;
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load images';
        setErrorMessage(msg);
        return false;
      } finally {
        inFlightRef.current = false;
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [dispatch, isConnected],
  );

  useEffect(() => {
    fetchPage(1, 'initial');
  }, [fetchPage]);

  const refresh = useCallback(async () => {
    if (inFlightRef.current) return;
    setRefreshing(true);
    try {
      await fetchPage(1, 'refresh');
    } finally {
      if (mountedRef.current) setRefreshing(false);
    }
  }, [fetchPage]);

  const loadMore = useCallback(async () => {
    if (inFlightRef.current || !hasMore || refreshing) return false;
    return fetchPage(page + 1, 'more');
  }, [fetchPage, hasMore, page, refreshing]);

  const retry = useCallback(async () => {
    await fetchPage(1, 'refresh');
  }, [fetchPage]);

  return {
    items,
    hasMore,
    page,
    loading,
    refreshing,
    errorMessage,
    isConnected,
    refresh,
    loadMore,
    retry,
    inFlightRef,
  };
}
