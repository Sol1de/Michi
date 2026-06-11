import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import { useGroqChat } from '@/hooks/use-groq-chat';

type ChatContextValue = ReturnType<typeof useGroqChat> & {
  /** Title shown in the top app bar (current thématique, or default). */
  title: string;
  setTitle: (t: string) => void;
  /** Start a fresh conversation and reset the header title. */
  newThematique: (title?: string) => void;
};

const DEFAULT_TITLE = 'Nouvelle conversation';

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const chat = useGroqChat();
  const [title, setTitle] = useState(DEFAULT_TITLE);

  const value = useMemo<ChatContextValue>(
    () => ({
      ...chat,
      title,
      setTitle,
      newThematique: (t = DEFAULT_TITLE) => {
        chat.reset();
        setTitle(t);
      },
    }),
    [chat, title]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside <ChatProvider>');
  return ctx;
}
