import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserProfile} from '../../types/user';

type State = {profile: UserProfile | null};
const initial: State = {profile: null};

const profileSlice = createSlice({
  name: 'profile', initialState: initial,
  reducers: {
    setProfile(s, a: PayloadAction<UserProfile>) { s.profile = a.payload; },
    clearProfile: () => initial,
  },
});
export const {setProfile, clearProfile} = profileSlice.actions;
export default profileSlice.reducer;
