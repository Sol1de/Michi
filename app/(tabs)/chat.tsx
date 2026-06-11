import { StyleSheet } from 'react-native';

import GroqChat from '@/components/groq-chat';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ChatScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Chat IA</ThemedText>
      <ThemedText style={styles.subtitle}>Groq · llama-3.3-70b</ThemedText>
      <GroqChat />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 12, padding: 20, paddingTop: 80 },
  subtitle: { opacity: 0.6 },
});
