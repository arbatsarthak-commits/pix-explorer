import {AuthResponse, Gender, UserProfile} from '../types/user';
import {findUserByEmail, registerUser, toPublicProfile} from './usersStorage';

export type RegisterPayload = {
  name: string; email: string; password: string; gender: Gender;
  mobile: string; address: string; city: string; avatarUrl?: string | null;
};
export type LoginPayload = {email: string; password: string};

const token = (id: string) => `local-token-${id}`;

export async function register(payload: RegisterPayload): Promise<AuthResponse & {profile: UserProfile}> {
  const user = await registerUser({
    name: payload.name.trim(), email: payload.email.trim().toLowerCase(),
    password: payload.password, gender: payload.gender, mobile: payload.mobile.trim(),
    address: payload.address.trim(), city: payload.city, avatarUrl: payload.avatarUrl ?? null,
  });
  return {userId: user.id, token: token(user.id), profile: toPublicProfile(user)};
}

export async function login(payload: LoginPayload): Promise<AuthResponse & {profile: UserProfile}> {
  const user = await findUserByEmail(payload.email);
  if (!user || user.password !== payload.password) throw new Error('Invalid email or password.');
  return {userId: user.id, token: token(user.id), profile: toPublicProfile(user)};
}
