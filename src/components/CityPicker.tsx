import React, {useMemo, useState} from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {CITIES} from '../constants/cities';
import {useTheme} from '../theme/ThemeContext';

type Props = {
  value: string;
  onChange: (city: string) => void;
  label?: string;
  error?: string;
  placeholder?: string;
};

export default function CityPicker({
  value,
  onChange,
  label,
  error,
  placeholder = 'Select a city',
}: Props) {
  const {colors} = useTheme();
  const [visible, setVisible] = useState(false);

  const displayValue = useMemo(
    () => (value.trim().length > 0 ? value : placeholder),
    [placeholder, value],
  );

  const hasValue = value.trim().length > 0;

  function selectCity(city: string) {
    onChange(city);
    setVisible(false);
  }

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={[styles.label, {color: colors.text}]}>{label}</Text>
      ) : null}
      <Pressable
        onPress={() => setVisible(true)}
        accessibilityRole="button"
        style={({pressed}) => [
          styles.trigger,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
          },
          pressed && styles.pressed,
        ]}>
        <Text
          style={[
            styles.triggerText,
            {color: hasValue ? colors.text : colors.textSecondary},
          ]}>
          {displayValue}
        </Text>
        <Text style={[styles.chevron, {color: colors.textSecondary}]}>▼</Text>
      </Pressable>
      {error ? (
        <Text style={[styles.error, {color: colors.error}]}>{error}</Text>
      ) : null}

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}>
        <Pressable
          style={[styles.overlay, {backgroundColor: colors.overlay}]}
          onPress={() => setVisible(false)}>
          <Pressable
            style={[styles.sheet, {backgroundColor: colors.surface}]}
            onPress={e => e.stopPropagation()}>
            <Text style={[styles.sheetTitle, {color: colors.text}]}>
              Select City
            </Text>
            <FlatList
              data={CITIES}
              keyExtractor={item => item}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                const selected = item === value;
                return (
                  <Pressable
                    onPress={() => selectCity(item)}
                    style={({pressed}) => [
                      styles.cityRow,
                      {
                        backgroundColor: selected
                          ? colors.background
                          : colors.surface,
                      },
                      pressed && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.cityText,
                        {
                          color: colors.text,
                          fontWeight: selected ? '700' : '400',
                        },
                      ]}>
                      {item}
                    </Text>
                    {selected ? (
                      <Text style={[styles.check, {color: colors.primary}]}>
                        ✓
                      </Text>
                    ) : null}
                  </Pressable>
                );
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
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
  trigger: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  triggerText: {
    fontSize: 16,
    flex: 1,
  },
  chevron: {
    fontSize: 12,
    marginLeft: 8,
  },
  pressed: {
    opacity: 0.85,
  },
  error: {
    fontSize: 13,
    marginTop: 6,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  sheet: {
    borderRadius: 14,
    maxHeight: '70%',
    paddingVertical: 12,
    overflow: 'hidden',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  cityText: {
    fontSize: 16,
  },
  check: {
    fontSize: 16,
    fontWeight: '700',
  },
});
