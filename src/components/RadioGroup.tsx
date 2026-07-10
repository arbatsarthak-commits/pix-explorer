import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';

import {useTheme} from '../theme/ThemeContext';
import type {Gender} from '../types/user';

const OPTIONS: {value: Gender; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
  {value: 'other', label: 'Other'},
];

type Props = {
  value: Gender | null;
  onChange: (value: Gender) => void;
  label?: string;
  error?: string;
};

export default function RadioGroup({value, onChange, label, error}: Props) {
  const {colors} = useTheme();

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, {color: colors.text}]}>{label}</Text>
      ) : null}
      <View style={styles.row}>
        {OPTIONS.map(option => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onChange(option.value)}
              accessibilityRole="radio"
              accessibilityState={{selected}}
              style={({pressed}) => [
                styles.option,
                {
                  borderColor: selected ? colors.primary : colors.border,
                  backgroundColor: selected ? colors.surface : colors.background,
                },
                pressed && styles.pressed,
              ]}>
              <View
                style={[
                  styles.outerRing,
                  {borderColor: selected ? colors.primary : colors.textSecondary},
                ]}>
                {selected ? (
                  <View
                    style={[styles.innerDot, {backgroundColor: colors.primary}]}
                  />
                ) : null}
              </View>
              <Text style={[styles.optionLabel, {color: colors.text}]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
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
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minWidth: 96,
  },
  pressed: {
    opacity: 0.85,
  },
  outerRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  error: {
    fontSize: 13,
    marginTop: 6,
  },
});
