import {logout} from '../../redux/slices/authSlice';
import {clearFavorites} from '../../redux/slices/favoritesSlice';
import {resetImages} from '../../redux/slices/imagesSlice';
import {clearProfile} from '../../redux/slices/profileSlice';
import {clearAuthSession} from '../../services/authStorage';
import {AppDispatch} from '../../redux/store';

/** Clears session and in-memory state. Favorites remain in AsyncStorage per user. */
export async function performLogout(dispatch: AppDispatch) {
  await clearAuthSession();
  dispatch(logout());
  dispatch(clearProfile());
  dispatch(clearFavorites());
  dispatch(resetImages());
}
