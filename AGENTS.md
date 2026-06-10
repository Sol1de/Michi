# AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) and Codex when working with code in this repository.

## Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code. This project is on **Expo SDK 54** (React Native 0.81, React 19) with the **New Architecture** and **React Compiler** enabled. APIs from older SDKs are often wrong — verify against the v54 docs.

## Commands

```bash
npm run start      # expo start --tunnel (tunnel mode — works on physical device off-LAN)
npm run ios        # native iOS run
npm run android    # native Android run
npm run web        # web build (output: static)
npm run lint       # expo lint (eslint-config-expo flat config)
npm run reset-project  # move starter code to app-example/, scaffold blank app/
```

No test runner is configured. `npm run lint` is the only check.

## Architecture

Expo Router **file-based routing** — routes live in `app/`, not a central router config.

- `app/_layout.tsx` — root `Stack`. Wraps app in `@react-navigation/native` ThemeProvider (light/dark via `useColorScheme`). `unstable_settings.anchor = '(tabs)'`. Declares the `modal` screen (`presentation: 'modal'`).
- `app/(tabs)/_layout.tsx` — bottom `Tabs` (`index` = Home, `explore` = Explore). Tab buttons use `HapticTab`; icons via `IconSymbol`.
- Typed routes are on (`experiments.typedRoutes`) — route strings are type-checked.

Path alias: `@/*` → repo root (e.g. `@/components/themed-text`).

### Theming

`constants/theme.ts` `Colors` + `useColorScheme` hook (`.web.ts` variant for web) + `useThemeColor`. Use `ThemedText` / `ThemedView` instead of raw RN `Text`/`View` so components respond to light/dark. `IconSymbol` has an `.ios.tsx` (SF Symbols) and a default (Material Icons) variant — platform-resolved.

### Speech features

`components/speech-to-text.tsx` — STT via **expo-audio** recording → POST audio blob to **Deepgram** cloud API. Works in Expo Go (no native module needed). TTS uses **expo-speech**.

Deepgram config comes from env vars, read at build time via `process.env.EXPO_PUBLIC_*`:

- `EXPO_PUBLIC_DEEPGRAM_API_KEY`
- `EXPO_PUBLIC_DEEPGRAM_URL` (model/language/format encoded in the URL query string)

Set them in `.env.local` (gitignored). The `EXPO_PUBLIC_` prefix is required — Expo only inlines those into the client bundle. `.env.example` lists the unprefixed names for reference; the actual runtime vars need the prefix.

Mic permission strings are declared in `app.json` (`NSMicrophoneUsageDescription` iOS, `RECORD_AUDIO` Android).
