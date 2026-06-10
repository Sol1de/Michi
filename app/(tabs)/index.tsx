import { useState } from 'react';
import { Button, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import * as Speech from 'expo-speech';

import SpeechToText from '@/components/speech-to-text';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function HomeScreen() {
  const [textToSpeak, setTextToSpeak] = useState('Bonjour, comment ça va ?');
  const [speaking, setSpeaking] = useState(false);

  const speak = () => {
    setSpeaking(true);
    Speech.speak(textToSpeak, {
      language: 'fr-FR',
      onDone: () => setSpeaking(false),
      onStopped: () => setSpeaking(false),
      onError: () => setSpeaking(false),
    });
  };

  const stopSpeaking = () => {
    Speech.stop();
    setSpeaking(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ThemedText type="title">Test Voix FR</ThemedText>

      {/* TTS — marche dans Expo Go */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">TTS — texte → voix</ThemedText>
        <TextInput
          style={styles.input}
          value={textToSpeak}
          onChangeText={setTextToSpeak}
          placeholder="Texte à lire"
          multiline
        />
        <View style={styles.row}>
          <Button title="🔊 Parler" onPress={speak} disabled={speaking} />
          <Button title="⏹ Stop" onPress={stopSpeaking} disabled={!speaking} />
        </View>
      </ThemedView>

      {/* STT — Deepgram cloud, marche dans Expo Go */}
      <ThemedView style={styles.card}>
        <ThemedText type="subtitle">STT — voix → texte (Deepgram)</ThemedText>
        <SpeechToText />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20, padding: 20, paddingTop: 80 },
  card: {
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
  },
  input: {
    minHeight: 60,
    padding: 12,
    borderRadius: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#888',
    fontSize: 18,
    color: '#888',
  },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center' },
});
