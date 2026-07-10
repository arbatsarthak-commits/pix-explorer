import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../../navigation/types';
import AppHeader from '../../components/AppHeader';
import AppTextInput from '../../components/AppTextInput';
import EmptyState from '../../components/EmptyState';
import ErrorState from '../../components/ErrorState';
import ImageCard from '../../components/ImageCard';
import ScreenContainer from '../../components/ScreenContainer';
import SkeletonLoader from '../../components/SkeletonLoader';
import {useDebounce} from '../../hooks/useDebounce';
import {useNetwork} from '../../hooks/useNetwork';
import {
  addFavorite,
  removeFavorite,
} from '../../redux/slices/favoritesSlice';
import {
  appendImages,
  clearImages,
  setHasMore,
  setPage,
} from '../../redux/slices/imagesSlice';
import type {AppDispatch, RootState} from '../../redux/store';
import {saveFavorites} from '../../services/favoritesStorage';
import {fetchPicsumImages} from '../../services/imagesApi';
import {useTheme} from '../../theme/ThemeContext';
import type {ImageItem} from '../../types/image';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

type AuthorRangeFilter = 'all' | 'am' | 'nz';

const PAGE_SIZE = 20;
const ITEM_HEIGHT = 252;
const MIN_FILTERED_ITEMS = 8;

function normalize(s: string) {
  return s.trim().toLowerCase();
}

function authorRangeForFilter(author: string, filter: AuthorRangeFilter) {
  if (filter === 'all') return true;
  const first = normalize(author).charAt(0).toUpperCase();
  if (!first) return false;
  const code = first.charCodeAt(0);
  const isAM = code >= 65 && code <= 77;
  return filter === 'am' ? isAM : !isAM;
}

function matchesSearch(item: ImageItem, query: string) {
  const q = normalize(query);
  if (!q) return true;
  return (
    normalize(item.author).includes(q) || normalize(item.id).includes(q)
  );
}

export default function HomeScreen({navigation}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {colors} = useTheme();
  const {isConnected} = useNetwork();

  const userId = useSelector((s: RootState) => s.auth.userId);
  const {items, hasMore, page} = useSelector((s: RootState) => s.images);
  const {favoriteImageIds, favoriteMetadata} = useSelector(
    (s: RootState) => s.favorites,
  );

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [filter, setFilter] = useState<AuthorRangeFilter>('all');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const favoriteSet = useMemo(
    () => new Set(favoriteImageIds),
    [favoriteImageIds],
  );

  useEffect(() => {
    if (!userId) return;
    saveFavorites(userId, favoriteImageIds, favoriteMetadata).catch(() => {});
  }, [userId, favoriteImageIds, favoriteMetadata]);

  const filteredItems = useMemo(() => {
    return items
      .filter(i => matchesSearch(i, debouncedQuery))
      .filter(i => authorRangeForFilter(i.author, filter));
  }, [debouncedQuery, filter, items]);

  const hasActiveFilter = filter !== 'all' || normalize(debouncedQuery).length > 0;

  const fetchImages = useCallback(
    async (nextPage: number, reset: boolean) => {
      if (!isConnected) {
        setErrorMessage('No internet connection. Please check your network.');
        return;
      }

      try {
        setErrorMessage(null);
        if (reset) {
          dispatch(clearImages());
        }

        const data = await fetchPicsumImages({page: nextPage, limit: PAGE_SIZE});
        dispatch(appendImages(data));
        dispatch(setPage(nextPage));
        dispatch(setHasMore(data.length === PAGE_SIZE));
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : 'Failed to load images';
        setErrorMessage(msg);
      }
    },
    [dispatch, isConnected],
  );

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await fetchImages(1, true);
      } finally {
        setLoading(false);
      }
    })();
  }, [fetchImages]);

  useEffect(() => {
    if (!hasActiveFilter || loading || refreshing || !hasMore || !isConnected) {
      return;
    }
    if (filteredItems.length >= MIN_FILTERED_ITEMS) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await fetchImages(page + 1, false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [
    fetchImages,
    filteredItems.length,
    hasActiveFilter,
    hasMore,
    isConnected,
    loading,
    page,
    refreshing,
  ]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchImages(1, true);
    } finally {
      setRefreshing(false);
    }
  }, [fetchImages]);

  const onRetry = useCallback(() => {
    setLoading(true);
    fetchImages(1, true).finally(() => setLoading(false));
  }, [fetchImages]);

  const onEndReached = useCallback(() => {
    if (loading || refreshing || !hasMore || !isConnected) return;
    setLoading(true);
    fetchImages(page + 1, false).finally(() => setLoading(false));
  }, [fetchImages, hasMore, isConnected, loading, page, refreshing]);

  const toggleFavorite = useCallback(
    (item: ImageItem) => {
      if (favoriteSet.has(item.id)) {
        dispatch(removeFavorite(item.id));
      } else {
        dispatch(addFavorite(item));
      }
    },
    [dispatch, favoriteSet],
  );

  const openDetails = useCallback(
    (item: ImageItem) => {
      navigation.navigate('ImageDetails', {
        imageId: item.id,
        url: item.url,
        author: item.author,
      });
    },
    [navigation],
  );

  const renderItem: ListRenderItem<ImageItem> = useCallback(
    ({item}) => (
      <ImageCard
        item={item}
        isFavorite={favoriteSet.has(item.id)}
        onPress={() => openDetails(item)}
        onFavoritePress={() => toggleFavorite(item)}
      />
    ),
    [favoriteSet, openDetails, toggleFavorite],
  );

  const keyExtractor = useCallback((item: ImageItem) => item.id, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<ImageItem> | null | undefined, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const listEmpty = useMemo(() => {
    if (loading) return null;
    if (errorMessage) return null;
    return (
      <EmptyState
        emoji="🖼️"
        title="No images found"
        message="Try adjusting your search or filter, or scroll to load more photos."
      />
    );
  }, [errorMessage, loading]);

  return (
    <ScreenContainer keyboardAvoiding={false} style={styles.screen}>
      <AppHeader title="Image Gallery" activeRoute="Home" />

      {!isConnected ? (
        <View style={[styles.offlineBanner, {backgroundColor: colors.error}]}>
          <Text style={styles.offlineText}>You are offline</Text>
        </View>
      ) : null}

      <View style={styles.controls}>
        <AppTextInput
          placeholder="Search by author or ID"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          style={styles.searchInput}
        />

        <View style={styles.filterRow}>
          <FilterButton
            label="All"
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <FilterButton
            label="A–M"
            active={filter === 'am'}
            onPress={() => setFilter('am')}
          />
          <FilterButton
            label="N–Z"
            active={filter === 'nz'}
            onPress={() => setFilter('nz')}
          />
        </View>
      </View>

      {loading && items.length === 0 && !errorMessage ? (
        <SkeletonLoader count={5} />
      ) : errorMessage && items.length === 0 ? (
        <ErrorState message={errorMessage} onRetry={onRetry} />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={listEmpty}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            loading && hasMore ? (
              <View style={styles.footer}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </ScreenContainer>
  );
}

function FilterButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const {colors} = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{selected: active}}
      style={[
        styles.filterButton,
        {
          backgroundColor: active ? colors.primary : colors.surface,
          borderColor: active ? colors.primary : colors.border,
        },
      ]}>
      <Text
        style={[
          styles.filterLabel,
          {color: active ? '#FFFFFF' : colors.text},
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  offlineBanner: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchInput: {
    marginBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  filterButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
