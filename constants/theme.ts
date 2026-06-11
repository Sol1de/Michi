import { DarkTheme as NavDarkTheme, type Theme } from '@react-navigation/native';

/**
 * Michi warm-dark palette (hex) — for contexts that need raw color values
 * instead of NativeWind classes: react-navigation theme, drawer styling,
 * lucide icon color props, StatusBar. Mirrors the CSS vars in global.css.
 */
export const MICHI = {
  background: '#15110F',
  card: '#2E2926',
  input: '#241E1C',
  border: '#3A322E',
  primary: '#FFC7AD',
  primaryForeground: '#794E38',
  secondary: '#F6B6BC',
  secondaryForeground: '#3A2A2C',
  foreground: '#F5EDE8',
  mutedForeground: '#A8978C',
  accent: '#895840',
} as const;

export const MichiNavTheme: Theme = {
  ...NavDarkTheme,
  colors: {
    ...NavDarkTheme.colors,
    background: MICHI.background,
    card: MICHI.background,
    text: MICHI.foreground,
    border: MICHI.border,
    primary: MICHI.primary,
    notification: MICHI.secondary,
  },
};
