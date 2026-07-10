import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {Appearance, ColorSchemeName} from 'react-native';
import {DarkTheme, DefaultTheme, Theme} from '@react-navigation/native';
import {AppColors, darkColors, lightColors} from './colors';

type Ctx = {colors: AppColors; isDark: boolean; navigationTheme: Theme};
const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({children}: {children: React.ReactNode}) {
  const [colorScheme, setColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme(),
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme: next}) => {
      setColorScheme(next);
    });
    return () => subscription.remove();
  }, []);

  const isDark = colorScheme === 'dark';

  const value = useMemo<Ctx>(() => {
    const colors = isDark ? darkColors : lightColors;
    const base = isDark ? DarkTheme : DefaultTheme;
    return {
      colors,
      isDark,
      navigationTheme: {
        ...base,
        colors: {
          ...base.colors,
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
        },
      },
    };
  }, [isDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Ctx {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
