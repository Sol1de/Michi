import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';

const GROQ_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_URL = process.env.EXPO_PUBLIC_GROQ_URL
const GROQ_MODEL = process.env.EXPO_PUBLIC_GROQ_MODEL;

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

const SYSTEM_PROMPT: Message = {
  role: 'system',
  content: 'Tu es un assistant utile. Réponds en français, de façon concise.',
};

// Chat cloud via Groq (API compatible OpenAI). Marche dans Expo Go (fetch).
export default function GroqChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (!GROQ_KEY || !GROQ_URL || !GROQ_MODEL) {
      setError('Config Groq manquante : EXPO_PUBLIC_GROQ_API_KEY dans .env.local');
      return;
    }

    setError('');
    const next = [...messages, { role: 'user', content: text } as Message];
    setMessages(next);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${GROQ_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: [SYSTEM_PROMPT, ...next],
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Groq ${res.status}: ${txt}`);
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

  return (
    <View style={styles.wrap}>
      <ScrollView
        ref={scrollRef}
        style={styles.history}
        contentContainerStyle={styles.historyContent}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
        {messages.length === 0 ? (
          <ThemedText style={styles.hint}>
            Pose une question pour démarrer la conversation.
          </ThemedText>
        ) : (
          messages.map((m, i) => (
            <View
              key={i}
              style={[styles.bubble, m.role === 'user' ? styles.userBubble : styles.aiBubble]}>
              <ThemedText style={styles.role}>
                {m.role === 'user' ? 'Toi' : 'IA'}
              </ThemedText>
              <ThemedText>{m.content}</ThemedText>
            </View>
          ))
        )}
        {loading ? <ActivityIndicator style={styles.spinner} /> : null}
      </ScrollView>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Écris un message…"
          placeholderTextColor="#888"
          multiline
          editable={!loading}
          onSubmitEditing={send}
        />
        <Button title="Envoyer" onPress={send} disabled={loading || !input.trim()} />
      </View>
      <Button title="🗑 Réinitialiser" onPress={reset} disabled={loading || messages.length === 0} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12, flex: 1 },
  history: { maxHeight: 420, minHeight: 200 },
  historyContent: { gap: 10, paddingVertical: 8 },
  hint: { color: '#888', textAlign: 'center', marginTop: 20 },
  bubble: { padding: 12, borderRadius: 12, maxWidth: '90%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#0a7ea433' },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#88888833' },
  role: { fontSize: 12, opacity: 0.6, marginBottom: 4 },
  spinner: { marginTop: 8 },
  inputRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-end' },
  input: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    padding: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
    fontSize: 16,
    color: '#888',
  },
  error: { color: '#e00' },
});
