import React, {useMemo} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import {useTheme} from '../theme/ThemeContext';

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export default function AppTextInput({
  label,
  error,
  style,
  editable = true,
  ...rest
}: Props) {
  const {colors} = useTheme();

  const inputStyle = useMemo(
    () => [
      styles.input,
      {
        backgroundColor: colors.surface,
        borderColor: error ? colors.error : colors.border,
        color: colors.text,
      },
      !editable && styles.inputDisabled,
      style,
    ],
    [colors, error, editable, style],
  );

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, {color: colors.text}]}>{label}</Text>
      ) : null}
      <TextInput
        placeholderTextColor={colors.textSecondary}
        editable={editable}
        style={inputStyle}
        {...rest}
      />
      {error ? (
        <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  inputDisabled: {
    opacity: 0.6,
  },
  error: {
    fontSize: 13,
    marginTop: 6,
  },
});
