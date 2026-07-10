import React from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import AppCard from './AppCard';
import {useTheme} from '../theme/ThemeContext';
import type {ImageItem} from '../types/image';

type Props = {
  item: ImageItem;
  isFavorite: boolean;
  onPress: () => void;
  onFavoritePress: () => void;
};

export default function ImageCard({
  item,
  isFavorite,
  onPress,
  onFavoritePress,
}: Props) {
  const {colors} = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({pressed}) => [styles.wrapper, pressed && styles.pressed]}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.meta}>
            <Text style={[styles.author, {color: colors.text}]} numberOfLines={1}>
              {item.author}
            </Text>
            <Text style={[styles.imageId, {color: colors.textSecondary}]}>
              ID: {item.id}
            </Text>
          </View>
          <Pressable
            onPress={onFavoritePress}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? 'Remove from favorites' : 'Add to favorites'
            }
            style={({pressed: favPressed}) => [
              styles.favoriteButton,
              favPressed && styles.pressed,
            ]}>
            <Text
              style={[
                styles.heart,
                {color: isFavorite ? colors.error : colors.textSecondary},
              ]}>
              {isFavorite ? '♥' : '♡'}
            </Text>
          </Pressable>
        </View>
        <View style={[styles.thumbnail, {backgroundColor: colors.skeleton}]}>
          <Image
            source={{uri: item.url}}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  meta: {
    flex: 1,
    marginRight: 8,
  },
  author: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  imageId: {
    fontSize: 12,
    fontWeight: '500',
  },
  favoriteButton: {
    padding: 4,
  },
  heart: {
    fontSize: 22,
  },
  thumbnail: {
    height: 160,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  pressed: {
    opacity: 0.85,
  },
});
