import React from 'react';
import {StyleSheet, View, ViewStyle} from 'react-native';

import {useTheme} from '../theme/ThemeContext';

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function AppCard({children, style}: Props) {
  const {colors, isDark} = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          shadowOpacity: isDark ? 0 : 0.08,
          elevation: isDark ? 0 : 3,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 12,
  },
});
