import React, {useCallback, useState} from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../../navigation/types';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import ScreenContainer from '../../components/ScreenContainer';
import {showToast} from '../../components/Toast';
import {useTheme} from '../../theme/ThemeContext';
import {downloadImageToGallery, shareImage} from '../../utils/imageActions';

type Props = NativeStackScreenProps<RootStackParamList, 'ImageDetails'>;

export default function ImageDetailsScreen({navigation, route}: Props) {
  const {colors} = useTheme();
  const {imageId, url, author} = route.params;

  const [fullscreen, setFullscreen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);

  const onDownload = useCallback(async () => {
    try {
      setDownloading(true);
      const result = await downloadImageToGallery(url);
      showToast({
        message:
          result === 'saved'
            ? 'Image saved to gallery'
            : 'Could not save to gallery. Image link shared instead.',
        type: 'success',
      });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Download failed';
      showToast({message, type: 'error'});
    } finally {
      setDownloading(false);
    }
  }, [url]);

  const onShare = useCallback(async () => {
    try {
      setSharing(true);
      await shareImage(url, `Photo by ${author}`);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Share failed';
      showToast({message, type: 'error'});
    } finally {
      setSharing(false);
    }
  }, [author, url]);

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <Pressable
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        style={styles.backRow}>
        <Text style={[styles.backText, {color: colors.primary}]}>← Back</Text>
      </Pressable>

      <Pressable onPress={() => setFullscreen(true)} accessibilityRole="imagebutton">
        <View style={[styles.imageWrap, {backgroundColor: colors.skeleton}]}>
          <Image source={{uri: url}} style={styles.image} resizeMode="cover" />
        </View>
      </Pressable>

      <AppCard style={styles.infoCard}>
        <Text style={[styles.label, {color: colors.textSecondary}]}>Author</Text>
        <Text style={[styles.value, {color: colors.text}]}>{author}</Text>

        <Text style={[styles.label, {color: colors.textSecondary}]}>Image ID</Text>
        <Text style={[styles.value, {color: colors.text}]}>{imageId}</Text>
      </AppCard>

      <View style={styles.actions}>
        <AppButton
          title="Download"
          onPress={onDownload}
          loading={downloading}
          style={styles.actionButton}
        />
        <AppButton
          title="Share"
          onPress={onShare}
          loading={sharing}
          variant="secondary"
          style={styles.actionButton}
        />
        <AppButton
          title="View Fullscreen"
          onPress={() => setFullscreen(true)}
          variant="secondary"
        />
      </View>

      <Modal
        visible={fullscreen}
        transparent
        animationType="fade"
        onRequestClose={() => setFullscreen(false)}>
        <ImageViewer
          imageUrls={[{url}]}
          enableSwipeDown
          onSwipeDown={() => setFullscreen(false)}
          onClick={() => setFullscreen(false)}
          backgroundColor={colors.overlay}
          renderHeader={() => (
            <Pressable
              onPress={() => setFullscreen(false)}
              style={styles.closeButton}
              accessibilityRole="button">
              <Text style={styles.closeText}>✕ Close</Text>
            </Pressable>
          )}
        />
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 8,
  },
  backRow: {
    marginBottom: 12,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  imageWrap: {
    height: 280,
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoCard: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
  actions: {
    gap: 12,
  },
  actionButton: {
    marginBottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 20,
    zIndex: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
