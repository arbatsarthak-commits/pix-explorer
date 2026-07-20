import {useEffect} from 'react';
import {useSelector} from 'react-redux';

import type {RootState} from '../redux/store';
import {saveFavorites} from '../services/favoritesStorage';

/** Persists favorites to AsyncStorage whenever Redux favorites change. */
export function useFavoritesPersistence() {
  const userId = useSelector((s: RootState) => s.auth.userId);
  const {favoriteImageIds, favoriteMetadata} = useSelector(
    (s: RootState) => s.favorites,
  );

  useEffect(() => {
    if (!userId) return;
    saveFavorites(userId, favoriteImageIds, favoriteMetadata).catch(() => {});
  }, [userId, favoriteImageIds, favoriteMetadata]);
}
