import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type AuthState = {
  isAuthenticated: boolean;
  userId: string | null;
  token: string | null;
};

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{userId: string; token: string}>,
    ) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
    },
    setAuthFromStorage: (
      state,
      action: PayloadAction<{userId: string; token: string}>,
    ) => {
      state.isAuthenticated = true;
      state.userId = action.payload.userId;
      state.token = action.payload.token;
    },
    logout: state => {
      state.isAuthenticated = false;
      state.userId = null;
      state.token = null;
    },
  },
});


export const {loginSuccess, setAuthFromStorage, logout} = authSlice.actions;
export default authSlice.reducer;



