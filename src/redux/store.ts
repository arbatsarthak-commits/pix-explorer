import {configureStore} from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import profileReducer from './slices/profileSlice';
import favoritesReducer from './slices/favoritesSlice';
import imagesReducer from './slices/imagesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    favorites: favoritesReducer,
    images: imagesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

