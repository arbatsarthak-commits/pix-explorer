import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ImageItem} from '../../types/image';

type State = {favoriteImageIds: string[]; favoriteMetadata: Record<string, ImageItem>};
const initial: State = {favoriteImageIds: [], favoriteMetadata: {}};

const favoritesSlice = createSlice({
  name: 'favorites', initialState: initial,
  reducers: {
    addFavorite(s, a: PayloadAction<ImageItem>) {
      if (!s.favoriteImageIds.includes(a.payload.id)) s.favoriteImageIds.push(a.payload.id);
      s.favoriteMetadata[a.payload.id] = a.payload;
    },
    removeFavorite(s, a: PayloadAction<string>) {
      s.favoriteImageIds = s.favoriteImageIds.filter(id => id !== a.payload);
      delete s.favoriteMetadata[a.payload];
    },
    setFavorites(s, a: PayloadAction<{ids: string[]; metadata: Record<string, ImageItem>}>) {
      s.favoriteImageIds = a.payload.ids; s.favoriteMetadata = a.payload.metadata;
    },
    clearFavorites: () => initial,
  },
});
export const {addFavorite, removeFavorite, setFavorites, clearFavorites} = favoritesSlice.actions;
export default favoritesSlice.reducer;
