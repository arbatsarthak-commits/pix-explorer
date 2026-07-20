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
import {useImagePagination} from '../../hooks/useImagePagination';
import {
  addFavorite,
  removeFavorite,
} from '../../redux/slices/favoritesSlice';
import type {AppDispatch, RootState} from '../../redux/store';
import {useTheme} from '../../theme/ThemeContext';
import type {ImageItem} from '../../types/image';
import {
  type AuthorRangeFilter,
  filterImages,
  hasActiveImageFilter,
} from '../../utils/imageFilters';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const ITEM_HEIGHT = 252;
const MIN_FILTERED_ITEMS = 8;

export default function HomeScreen({navigation}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {colors} = useTheme();

  const {favoriteImageIds} = useSelector((s: RootState) => s.favorites);
  const {
    items,
    hasMore,
    loading,
    refreshing,
    errorMessage,
    isConnected,
    refresh,
    loadMore,
    retry,
    inFlightRef,
  } = useImagePagination();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<AuthorRangeFilter>('all');
  const [loadingMore, setLoadingMore] = useState(false);

  const favoriteSet = useMemo(
    () => new Set(favoriteImageIds),
    [favoriteImageIds],
  );

  const filteredItems = useMemo(
    () => filterImages(items, query, filter),
    [items, query, filter],
  );

  const activeFilter = hasActiveImageFilter(query, filter);

  const tryLoadMore = useCallback(async () => {
    if (inFlightRef.current || !hasMore || refreshing) return;
    setLoadingMore(true);
    try {
      await loadMore();
    } finally {
      setLoadingMore(false);
    }
  }, [hasMore, inFlightRef, loadMore, refreshing]);

  useEffect(() => {
    if (!activeFilter || !hasMore || loading || refreshing || loadingMore) {
      return;
    }
    if (filteredItems.length >= MIN_FILTERED_ITEMS) return;

    tryLoadMore();
  }, [
    activeFilter,
    filteredItems.length,
    hasMore,
    loading,
    loadingMore,
    refreshing,
    tryLoadMore,
  ]);

  const onEndReached = useCallback(() => {
    if (loading || refreshing || loadingMore || !hasMore || !isConnected) {
      return;
    }
    tryLoadMore();
  }, [
    hasMore,
    isConnected,
    loading,
    loadingMore,
    refreshing,
    tryLoadMore,
  ]);

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

  const showFooterLoader =
    (loadingMore || (loading && items.length > 0)) && hasMore;

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
        <ErrorState
          message={errorMessage}
          onRetry={() => {
            setLoadingMore(true);
            retry().finally(() => setLoadingMore(false));
          }}
        />
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
            <RefreshControl refreshing={refreshing} onRefresh={refresh} />
          }
          ListFooterComponent={
            showFooterLoader ? (
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
