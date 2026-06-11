import { useState } from 'react';

export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

const GROQ_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_URL = process.env.EXPO_PUBLIC_GROQ_URL;
const GROQ_MODEL = process.env.EXPO_PUBLIC_GROQ_MODEL;

const SYSTEM_PROMPT: ChatMessage = {
  role: 'system',
  content:
    "Tu es Michi, un compagnon d'étude du japonais bienveillant et patient. " +
    "Aide l'utilisateur à progresser (vocabulaire, grammaire JLPT, conversation). " +
    'Réponds en français, de façon concise. Donne des exemples en japonais avec la lecture quand utile.',
};

// Chat cloud via Groq (API compatible OpenAI). Marche dans Expo Go (fetch).
export function useGroqChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const send = async (text: string) => {
    const t = text.trim();
    if (!t || loading) return;

    if (!GROQ_KEY || !GROQ_URL || !GROQ_MODEL) {
      setError('Config Groq manquante : EXPO_PUBLIC_GROQ_API_KEY / _URL / _MODEL dans .env.local');
      return;
    }

    setError('');
    const next = [...messages, { role: 'user', content: t } as ChatMessage];
    setMessages(next);
    setLoading(true);

    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ model: GROQ_MODEL, messages: [SYSTEM_PROMPT, ...next] }),
      });

      if (!res.ok) {
        throw new Error(`Groq ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      const reply: string = json?.choices?.[0]?.message?.content ?? '(réponse vide)';
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (e: any) {
      setError(e?.message ?? 'Erreur chat');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setError('');
  };

  return { messages, loading, error, send, reset };
}
