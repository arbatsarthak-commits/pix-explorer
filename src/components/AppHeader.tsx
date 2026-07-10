import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../navigation/types';
import {useTheme} from '../theme/ThemeContext';

type NavRoute = 'Home' | 'Favorites' | 'Profile';

type Props = {
  title: string;
  activeRoute?: NavRoute;
};

const NAV_ITEMS: {route: NavRoute; label: string}[] = [
  {route: 'Home', label: 'Home'},
  {route: 'Favorites', label: 'Favorites'},
  {route: 'Profile', label: 'Profile'},
];

export default function AppHeader({title, activeRoute}: Props) {
  const {colors} = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={[styles.container, {borderBottomColor: colors.border}]}>
      <Text style={[styles.title, {color: colors.text}]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.navRow}>
        {NAV_ITEMS.map(item => {
          const isActive = activeRoute === item.route;
          return (
            <Pressable
              key={item.route}
              onPress={() => navigation.navigate(item.route)}
              accessibilityRole="button"
              accessibilityState={{selected: isActive}}
              style={({pressed}) => [
                styles.navButton,
                {
                  backgroundColor: isActive ? colors.primary : colors.surface,
                  borderColor: isActive ? colors.primary : colors.border,
                },
                pressed && styles.pressed,
              ]}>
              <Text
                style={[
                  styles.navLabel,
                  {color: isActive ? '#FFFFFF' : colors.text},
                ]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 12,
  },
  navRow: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.85,
  },
});
