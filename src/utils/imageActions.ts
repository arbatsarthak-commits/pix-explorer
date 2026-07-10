import {PermissionsAndroid, Platform, Share} from 'react-native';

export type DownloadResult = 'saved' | 'shared';

export async function requestStoragePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  const perm =
    Platform.Version >= 33
      ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
      : PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
  const result = await PermissionsAndroid.request(perm);
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function downloadImageToGallery(url: string): Promise<DownloadResult> {
  if (!(await requestStoragePermission())) {
    throw new Error('Storage permission denied.');
  }

  try {
    const {CameraRoll} = require('@react-native-camera-roll/camera-roll');
    await CameraRoll.save(url, {type: 'photo'});
    return 'saved';
  } catch {
    await Share.share({message: `Download image: ${url}`, url});
    return 'shared';
  }
}

export async function shareImage(url: string, message: string): Promise<void> {
  await Share.share({message: `${message}\n${url}`, url});
}
