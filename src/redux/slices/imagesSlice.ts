import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ImageItem} from '../../types/image';

type State = {items: ImageItem[]; searchQuery: string; page: number; hasMore: boolean};
const initial: State = {items: [], searchQuery: '', page: 1, hasMore: true};

const imagesSlice = createSlice({
  name: 'images', initialState: initial,
  reducers: {
    setSearchQuery(s, a: PayloadAction<string>) {
      s.searchQuery = a.payload;
    },
    clearImages(s) {
      s.items = [];
      s.page = 1;
      s.hasMore = true;
    },
    appendImages(s, a: PayloadAction<ImageItem[]>) {
      const ids = new Set(s.items.map(i => i.id));
      s.items.push(...a.payload.filter(i => !ids.has(i.id)));
    },
    setPage(s, a: PayloadAction<number>) { s.page = a.payload; },
    setHasMore(s, a: PayloadAction<boolean>) { s.hasMore = a.payload; },
    resetImages: () => initial,
  },
});
export const {
  setSearchQuery,
  clearImages,
  appendImages,
  setPage,
  setHasMore,
  resetImages,
} = imagesSlice.actions;
export default imagesSlice.reducer;
