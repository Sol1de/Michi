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

## Product

**Michi** — a Japanese-learning chat companion (JLPT-oriented). The UI is a single warm-dark chat experience matching the Figma mockup: an empty "welcome" state, an active chat thread, and a slide-out drawer for thématiques (conversation categories).

## Architecture

Expo Router **file-based routing** — routes live in `app/`, not a central router config.

- `app/_layout.tsx` — root `Stack` (single child `(drawer)`, header hidden). Wraps app in `GestureHandlerRootView` + `@react-navigation/native` ThemeProvider (`MichiNavTheme`) + RNR `PortalHost`. Locks dark mode via `colorScheme.set('dark')` (nativewind). `unstable_settings.anchor = '(drawer)'`.
- `app/(drawer)/_layout.tsx` — `Drawer` (`expo-router/drawer`) with a custom `drawerContent` = `MichiSidebar`. Wrapped in `ChatProvider` so the sidebar and screens share chat state. Screens: `index` (chat), `settings`.
- `app/(drawer)/index.tsx` — main chat. Empty state (`ChatEmptyState`) ↔ active thread (`MessageBubble` list). Header is `MichiHeader` (menu opens drawer, gear → settings).
- `app/(drawer)/settings.tsx` — hosts the preserved TTS + STT demos.
- Typed routes are on (`experiments.typedRoutes`) — route strings are type-checked. They regenerate at metro startup; after adding/removing routes, run the dev server once before `tsc`.

Path alias: `@/*` → repo root (e.g. `@/components/ui/text`).

### Chat / features wiring

- `hooks/use-groq-chat.ts` — Groq Cloud chat (OpenAI-compatible, fetch; works in Expo Go). Exposed app-wide via `components/chat/chat-provider.tsx` (`useChat()`), which also tracks the header title / thématique.
- `components/chat/chat-input.tsx` — bottom input bar. Mic toggles **STT** (`hooks/use-speech-to-text.ts`, Deepgram) and appends the transcript; send dispatches to Groq.
- `components/chat/message-bubble.tsx` — tapping an AI bubble reads it aloud via **TTS** (`lib/speak.ts`, expo-speech, auto-picks `ja-JP` when Japanese script is present).
- The drawer thématique list is **presentational** — selecting an item sets the header title and opens the chat; conversation history is not persisted (single live thread).

### UI / theming — react-native-reusables + NativeWind

Components come from **react-native-reusables** (shadcn-for-RN) in `components/ui/*`, styled with **NativeWind v4** (Tailwind classes via `className`). Prefer these primitives before writing a new one. Config: `tailwind.config.js`, `global.css` (CSS-var tokens), `babel.config.js` (`jsxImportSource: 'nativewind'` + `nativewind/babel`), `metro.config.js` (`withNativeWind`), `components.json` (CLI). Add components with `npx @react-native-reusables/cli add <name>`.

Single warm-dark theme (no light mode). Color tokens live as HSL CSS vars in `global.css`; raw hex equivalents (for nav theme, drawer style, lucide `color` props) are in `constants/theme.ts` (`MICHI`, `MichiNavTheme`). Icons are **lucide-react-native** via the RNR `Icon` (`as={LucideIcon}`).

### Speech features

STT via **expo-audio** recording → POST audio blob to **Deepgram** cloud API (`hooks/use-speech-to-text.ts`). Works in Expo Go (no native module needed). TTS uses **expo-speech** (`lib/speak.ts`). Both are surfaced in the chat (mic + tap-to-speak) and demoed in `app/(drawer)/settings.tsx`.

Deepgram config comes from env vars, read at build time via `process.env.EXPO_PUBLIC_*`:

- `EXPO_PUBLIC_DEEPGRAM_API_KEY`
- `EXPO_PUBLIC_DEEPGRAM_URL` (model/language/format encoded in the URL query string)

Groq chat (`hooks/use-groq-chat.ts`) reads the same way:

- `EXPO_PUBLIC_GROQ_API_KEY`
- `EXPO_PUBLIC_GROQ_URL` (e.g. `https://api.groq.com/openai/v1/chat/completions`)
- `EXPO_PUBLIC_GROQ_MODEL` (e.g. `llama-3.3-70b-versatile`)

Set them in `.env.local` (gitignored). The `EXPO_PUBLIC_` prefix is required — Expo only inlines those into the client bundle. `.env.example` lists the unprefixed names for reference; the actual runtime vars need the prefix.

Mic permission strings are declared in `app.json` (`NSMicrophoneUsageDescription` iOS, `RECORD_AUDIO` Android).
