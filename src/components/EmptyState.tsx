import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import AppButton from './AppButton';
import {useTheme} from '../theme/ThemeContext';

type Props = {
  emoji: string;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  emoji,
  title,
  message,
  actionLabel,
  onAction,
}: Props) {
  const {colors} = useTheme();

  return (
    <View style={styles.container}>
      <Text style={styles.emoji} accessibilityLabel="empty-state-icon">
        {emoji}
      </Text>
      <Text style={[styles.title, {color: colors.text}]}>{title}</Text>
      <Text style={[styles.message, {color: colors.textSecondary}]}>
        {message}
      </Text>
      {actionLabel && onAction ? (
        <View style={styles.action}>
          <AppButton title={actionLabel} onPress={onAction} variant="secondary" />
        </View>
      ) : null}
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
  emoji: {
    fontSize: 48,
    marginBottom: 16,
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
