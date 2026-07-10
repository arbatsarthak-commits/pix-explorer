import React, {useMemo} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

import {useTheme} from '../theme/ThemeContext';

type Variant = 'primary' | 'secondary' | 'danger';

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}: Props) {
  const {colors} = useTheme();
  const isDisabled = disabled || loading;

  const variantColors = useMemo(() => {
    switch (variant) {
      case 'secondary':
        return {
          background: colors.surface,
          text: colors.primary,
          border: colors.primary,
          pressed: colors.border,
        };
      case 'danger':
        return {
          background: colors.error,
          text: '#FFFFFF',
          border: colors.error,
          pressed: colors.error,
        };
      default:
        return {
          background: colors.primary,
          text: '#FFFFFF',
          border: colors.primary,
          pressed: colors.primaryDark,
        };
    }
  }, [colors, variant]);

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{disabled: isDisabled, busy: loading}}
      style={({pressed}) => [
        styles.button,
        {
          backgroundColor: pressed && !isDisabled
            ? variantColors.pressed
            : variantColors.background,
          borderColor: variantColors.border,
        },
        variant === 'secondary' && styles.secondary,
        isDisabled && styles.disabled,
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={variantColors.text} />
      ) : (
        <Text style={[styles.title, {color: variantColors.text}]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  secondary: {
    borderWidth: 1.5,
  },
  disabled: {
    opacity: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
});
