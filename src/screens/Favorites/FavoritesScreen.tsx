import React, {useCallback, useMemo, useState} from 'react';
import {FlatList, ListRenderItem, StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../../navigation/types';
import AppHeader from '../../components/AppHeader';
import AppTextInput from '../../components/AppTextInput';
import EmptyState from '../../components/EmptyState';
import ImageCard from '../../components/ImageCard';
import ScreenContainer from '../../components/ScreenContainer';
import {removeFavorite} from '../../redux/slices/favoritesSlice';
import type {AppDispatch, RootState} from '../../redux/store';
import type {ImageItem} from '../../types/image';

type Props = NativeStackScreenProps<RootStackParamList, 'Favorites'>;

function normalize(s: string) {
  return s.trim().toLowerCase();
}

export default function FavoritesScreen({navigation}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {favoriteImageIds, favoriteMetadata} = useSelector(
    (s: RootState) => s.favorites,
  );

  const [query, setQuery] = useState('');

  const favoriteItems = useMemo(() => {
    const items = favoriteImageIds
      .map(id => favoriteMetadata[id])
      .filter((item): item is ImageItem => Boolean(item));

    const q = normalize(query);
    if (!q) return items;
    return items.filter(
      item =>
        normalize(item.author).includes(q) || normalize(item.id).includes(q),
    );
  }, [favoriteImageIds, favoriteMetadata, query]);

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

  const handleRemove = useCallback(
    (id: string) => {
      dispatch(removeFavorite(id));
    },
    [dispatch],
  );

  const renderItem: ListRenderItem<ImageItem> = useCallback(
    ({item}) => (
      <ImageCard
        item={item}
        isFavorite
        onPress={() => openDetails(item)}
        onFavoritePress={() => handleRemove(item.id)}
      />
    ),
    [handleRemove, openDetails],
  );

  const keyExtractor = useCallback((item: ImageItem) => item.id, []);

  return (
    <ScreenContainer keyboardAvoiding={false} style={styles.screen}>
      <AppHeader title="Favorites" activeRoute="Favorites" />

      <View style={styles.controls}>
        <AppTextInput
          placeholder="Search favorites"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          style={styles.searchInput}
        />
      </View>

      <FlatList
        data={favoriteItems}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            emoji="♡"
            title="No favorites yet"
            message="Images you favorite on the Home screen will appear here."
            actionLabel="Browse Images"
            onAction={() => navigation.navigate('Home')}
          />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingHorizontal: 0,
  },
  controls: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  searchInput: {
    marginBottom: 8,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
});
