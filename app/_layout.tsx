import '../global.css';

import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colorScheme } from 'nativewind';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { MichiNavTheme } from '@/constants/theme';

export const unstable_settings = {
  anchor: '(drawer)',
};

export default function RootLayout() {
  // Michi ships a single warm-dark theme — lock it regardless of the OS setting.
  useEffect(() => {
    colorScheme.set('dark');
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={MichiNavTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(drawer)" />
        </Stack>
        <StatusBar style="light" />
        <PortalHost />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
