import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {PermissionsAndroid, Platform, Share} from 'react-native';
import RNFS from 'react-native-fs';

export async function requestStoragePermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return true;
  // Android 10+ uses scoped storage — CameraRoll.save writes to MediaStore without permission.
  if (Platform.Version >= 29) return true;
  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function downloadImageToGallery(url: string): Promise<void> {
  if (!(await requestStoragePermission())) {
    throw new Error('Storage permission denied.');
  }

  const extension = /\.png(\?|$)/i.test(url) ? 'png' : 'jpg';
  const localPath = `${RNFS.CachesDirectoryPath}/gallery_${Date.now()}.${extension}`;

  try {
    const download = RNFS.downloadFile({fromUrl: url, toFile: localPath});
    const result = await download.promise;

    if (result.statusCode !== 200) {
      throw new Error(`Download failed (HTTP ${result.statusCode}).`);
    }

    const fileUri =
      Platform.OS === 'android' ? `file://${localPath}` : localPath;

    await CameraRoll.save(fileUri, {type: 'photo', album: 'InternshipApp'});
  } finally {
    await RNFS.unlink(localPath).catch(() => {});
  }
}

export async function shareImage(url: string, message: string): Promise<void> {
  await Share.share({message: `${message}\n${url}`, url});
}
