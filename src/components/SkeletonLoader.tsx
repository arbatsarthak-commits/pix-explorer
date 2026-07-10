import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';

import {useTheme} from '../theme/ThemeContext';

type Props = {
  count?: number;
};

function SkeletonCard({opacity}: {opacity: Animated.Value}) {
  const {colors} = useTheme();

  return (
    <View style={[styles.card, {backgroundColor: colors.card, borderColor: colors.border}]}>
      <Animated.View
        style={[styles.thumbnail, {backgroundColor: colors.skeleton, opacity}]}
      />
      <Animated.View
        style={[styles.lineShort, {backgroundColor: colors.skeleton, opacity}]}
      />
      <Animated.View
        style={[styles.lineLong, {backgroundColor: colors.skeleton, opacity}]}
      />
    </View>
  );
}

export default function SkeletonLoader({count = 4}: Props) {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.45,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [pulse]);

  return (
    <View style={styles.container}>
      {Array.from({length: count}, (_, index) => (
        <SkeletonCard key={`skeleton-${index}`} opacity={pulse} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 12,
    marginBottom: 12,
  },
  thumbnail: {
    height: 160,
    borderRadius: 10,
    marginBottom: 12,
  },
  lineShort: {
    height: 14,
    width: '40%',
    borderRadius: 6,
    marginBottom: 8,
  },
  lineLong: {
    height: 14,
    width: '70%',
    borderRadius: 6,
  },
});
