import AsyncStorage from '@react-native-async-storage/async-storage';
import {StoredUser, UserProfile} from '../types/user';

const USERS_KEY = 'users:registry';
const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

export async function loadAllUsers(): Promise<StoredUser[]> {
  const raw = await AsyncStorage.getItem(USERS_KEY);
  if (!raw) return [];
  try { const p = JSON.parse(raw); return Array.isArray(p) ? p : []; } catch { return []; }
}

async function saveAllUsers(users: StoredUser[]) {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const n = email.trim().toLowerCase();
  return (await loadAllUsers()).find(u => u.email === n) ?? null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  return (await loadAllUsers()).find(u => u.id === id) ?? null;
}

export async function registerUser(input: Omit<StoredUser, 'id'>): Promise<StoredUser> {
  if (await findUserByEmail(input.email)) throw new Error('An account with this email already exists.');
  const user: StoredUser = {...input, id: genId(), email: input.email.trim().toLowerCase()};
  const users = await loadAllUsers();
  users.push(user);
  await saveAllUsers(users);
  return user;
}

export async function updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  const users = await loadAllUsers();
  const i = users.findIndex(u => u.id === userId);
  if (i < 0) throw new Error('User not found.');
  users[i] = {...users[i], ...updates, id: users[i].id, email: users[i].email, password: users[i].password};
  await saveAllUsers(users);
  const {password: _, ...profile} = users[i];
  return profile;
}

export function toPublicProfile(user: StoredUser): UserProfile {
  const {password: _, ...profile} = user;
  return profile;
}
