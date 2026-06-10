import { useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import {
  useAudioRecorder,
  useAudioRecorderState,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
} from 'expo-audio';

import { ThemedText } from '@/components/themed-text';

const DEEPGRAM_KEY = process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY;
const DEEPGRAM_URL = process.env.EXPO_PUBLIC_DEEPGRAM_URL;

// STT cloud via Deepgram. Marche dans Expo Go (expo-audio + fetch).
export default function SpeechToText() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder);

  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const start = async () => {
    setError('');
    setTranscript('');
    const perm = await AudioModule.requestRecordingPermissionsAsync();
    if (!perm.granted) {
      setError('Permission micro refusée');
      return;
    }
    await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const stopAndTranscribe = async () => {
    await recorder.stop();
    const uri = recorder.uri;
    if (!uri) {
      setError('Aucun audio enregistré');
      return;
    }
    if (!DEEPGRAM_KEY || !DEEPGRAM_URL) {
      setError('Config Deepgram manquante (.env.local)');
      return;
    }

    setLoading(true);
    try {
      // Lit le fichier audio local en binaire
      const audioBlob = await (await fetch(uri)).blob();

      const res = await fetch(DEEPGRAM_URL, {
        method: 'POST',
        headers: {
          Authorization: `Token ${DEEPGRAM_KEY}`,
          'Content-Type': 'audio/m4a',
        },
        body: audioBlob,
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Deepgram ${res.status}: ${txt}`);
      }

      const json = await res.json();
      const text =
        json?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? '';
      setTranscript(text || '(rien détecté)');
    } catch (e: any) {
      setError(e?.message ?? 'Erreur transcription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Button
          title={state.isRecording ? '🔴 Enregistre...' : '🎙 Parler'}
          onPress={start}
          disabled={state.isRecording || loading}
        />
        <Button
          title="⏹ Stop + Transcrire"
          onPress={stopAndTranscribe}
          disabled={!state.isRecording || loading}
        />
      </View>
      <ThemedText style={styles.transcript}>
        {loading
          ? 'Transcription...'
          : transcript || 'Appuie Parler, dis une phrase, puis Stop.'}
      </ThemedText>
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 12 },
  row: { flexDirection: 'row', gap: 12, alignItems: 'center', flexWrap: 'wrap' },
  transcript: { fontSize: 20, minHeight: 30 },
  error: { color: '#e00' },
});
