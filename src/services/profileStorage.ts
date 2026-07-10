import {findUserById, toPublicProfile} from './usersStorage';
import {UserProfile} from '../types/user';

export async function loadUserProfile(userId: string): Promise<UserProfile | null> {
  const user = await findUserById(userId);
  return user ? toPublicProfile(user) : null;
}
