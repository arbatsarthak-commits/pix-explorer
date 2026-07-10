import {logout} from '../../redux/slices/authSlice';
import {clearFavorites} from '../../redux/slices/favoritesSlice';
import {resetImages} from '../../redux/slices/imagesSlice';
import {clearProfile} from '../../redux/slices/profileSlice';
import {clearAuthSession} from '../../services/authStorage';
import {clearFavoritesForUser} from '../../services/favoritesStorage';
import {AppDispatch} from '../../redux/store';

export async function performLogout(
  dispatch: AppDispatch,
  userId: string | null,
) {
  if (userId) {
    await clearFavoritesForUser(userId);
  }
  await clearAuthSession();
  dispatch(logout());
  dispatch(clearProfile());
  dispatch(clearFavorites());
  dispatch(resetImages());
}
