export type Gender = 'male' | 'female' | 'other';

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  gender: Gender;
  mobile: string;
  address: string;
  city: string;
  avatarUrl: string | null;
};

export type StoredUser = UserProfile & {password: string};

export type AuthResponse = {userId: string; token: string};
