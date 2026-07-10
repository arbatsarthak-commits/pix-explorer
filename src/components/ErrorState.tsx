import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import AppButton from './AppButton';
import {useTheme} from '../theme/ThemeContext';

type Props = {
  message: string;
  onRetry: () => void;
  retryLabel?: string;
};

export default function ErrorState({
  message,
  onRetry,
  retryLabel = 'Try Again',
}: Props) {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.icon} accessibilityLabel="error-state-icon">
        ⚠️
      </Text>
      <Text style={[styles.title, {color: colors.text}]}>Something went wrong</Text>
      <Text style={[styles.message, {color: colors.textSecondary}]}>{message}</Text>
      <View style={styles.action}>
        <AppButton title={retryLabel} onPress={onRetry} variant="primary" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  icon: {
    fontSize: 40,
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  action: {
    marginTop: 20,
    alignSelf: 'stretch',
  },
});
