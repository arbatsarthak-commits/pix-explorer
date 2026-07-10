import AsyncStorage from '@react-native-async-storage/async-storage';
import {ImageItem} from '../types/image';

function idsKey(userId: string) {
  return `favorites:${userId}:imageIds`;
}

function metaKey(userId: string) {
  return `favorites:${userId}:metadata`;
}

export async function loadFavorites(
  userId: string,
): Promise<{ids: string[]; metadata: Record<string, ImageItem>}> {
  const [[, idsRaw], [, metaRaw]] = await AsyncStorage.multiGet([
    idsKey(userId),
    metaKey(userId),
  ]);
  let ids: string[] = [];
  let metadata: Record<string, ImageItem> = {};
  try {
    if (idsRaw) {
      const p = JSON.parse(idsRaw);
      if (Array.isArray(p)) ids = p.map(String);
    }
  } catch {
    /* ignore corrupt data */
  }
  try {
    if (metaRaw) {
      const p = JSON.parse(metaRaw);
      if (p && typeof p === 'object') metadata = p;
    }
  } catch {
    /* ignore corrupt data */
  }
  return {ids, metadata};
}

export async function saveFavorites(
  userId: string,
  ids: string[],
  metadata: Record<string, ImageItem>,
) {
  await AsyncStorage.multiSet([
    [idsKey(userId), JSON.stringify(ids)],
    [metaKey(userId), JSON.stringify(metadata)],
  ]);
}

export async function clearFavoritesForUser(userId: string) {
  await AsyncStorage.multiRemove([idsKey(userId), metaKey(userId)]);
}
