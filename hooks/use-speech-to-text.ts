import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from 'expo-audio';
import { useState } from 'react';

const DEEPGRAM_KEY = process.env.EXPO_PUBLIC_DEEPGRAM_API_KEY;
const DEEPGRAM_URL = process.env.EXPO_PUBLIC_DEEPGRAM_URL;

// STT cloud via Deepgram. Marche dans Expo Go (expo-audio + fetch).
export function useSpeechToText() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const state = useAudioRecorderState(recorder);
  const [transcribing, setTranscribing] = useState(false);
  const [error, setError] = useState('');

  const start = async (): Promise<boolean> => {
    setError('');
    const perm = await AudioModule.requestRecordingPermissionsAsync();
    if (!perm.granted) {
      setError('Permission micro refusée');
      return false;
    }
    await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    return true;
  };

  // Stop recording, send audio to Deepgram, resolve with the transcript ('' on failure).
  const stopAndTranscribe = async (): Promise<string> => {
    await recorder.stop();
    const uri = recorder.uri;
    if (!uri) {
      setError('Aucun audio enregistré');
      return '';
    }
    if (!DEEPGRAM_KEY || !DEEPGRAM_URL) {
      setError('Config Deepgram manquante (.env.local)');
      return '';
    }

    setTranscribing(true);
    try {
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
        throw new Error(`Deepgram ${res.status}: ${await res.text()}`);
      }

      const json = await res.json();
      return json?.results?.channels?.[0]?.alternatives?.[0]?.transcript ?? '';
    } catch (e: any) {
      setError(e?.message ?? 'Erreur transcription');
      return '';
    } finally {
      setTranscribing(false);
    }
  };

  return { isRecording: state.isRecording, transcribing, error, start, stopAndTranscribe };
}
