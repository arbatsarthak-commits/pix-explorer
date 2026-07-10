import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'auth:token';
const AUTH_USER_ID_KEY = 'auth:userId';

type AuthSession = {
  token: string;
  userId: string;
};

export async function saveAuthSession(session: AuthSession): Promise<void> {
  await AsyncStorage.multiSet([
    [AUTH_TOKEN_KEY, session.token],
    [AUTH_USER_ID_KEY, session.userId],
  ]);
}

export async function loadAuthSession(): Promise<AuthSession | null> {
  const [[, token], [, userId]] = await AsyncStorage.multiGet([
    AUTH_TOKEN_KEY,
    AUTH_USER_ID_KEY,
  ]);

  if (!token || !userId) return null;
  return {token, userId};
}

export async function clearAuthSession(): Promise<void> {
  await AsyncStorage.multiRemove([AUTH_TOKEN_KEY, AUTH_USER_ID_KEY]);
}

