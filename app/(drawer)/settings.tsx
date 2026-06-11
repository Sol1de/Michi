import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { MichiHeader } from '@/components/michi-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { useSpeechToText } from '@/hooks/use-speech-to-text';
import { speak, stopSpeaking } from '@/lib/speak';

// Réglages — héberge les démos des fonctionnalités vocales préservées (TTS + STT).
export default function SettingsScreen() {
  const router = useRouter();
  const [ttsText, setTtsText] = useState('こんにちは、元気ですか？');
  const [transcript, setTranscript] = useState('');
  const stt = useSpeechToText();

  const onMic = async () => {
    if (stt.isRecording) {
      const t = await stt.stopAndTranscribe();
      setTranscript(t || '(rien détecté)');
    } else {
      setTranscript('');
      await stt.start();
    }
  };

  return (
    <View className="bg-background flex-1">
      <MichiHeader
        title="Réglages"
        left={{ icon: ChevronLeft, label: 'Retour', onPress: () => router.back() }}
        right={null}
      />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 20 }}>
        {/* TTS */}
        <View className="bg-card border-border gap-3 rounded-2xl border p-4">
          <Text className="text-foreground text-lg font-semibold">Synthèse vocale (TTS)</Text>
          <Text className="text-muted-foreground text-sm">
            Lit un texte à voix haute. Voix japonaise auto-détectée.
          </Text>
          <Input
            value={ttsText}
            onChangeText={setTtsText}
            placeholder="Texte à lire"
            multiline
            className="h-auto min-h-12 py-2"
          />
          <View className="flex-row gap-2">
            <Button onPress={() => speak(ttsText)} className="flex-1">
              <Text>Lire</Text>
            </Button>
            <Button variant="outline" onPress={stopSpeaking} className="flex-1">
              <Text>Stop</Text>
            </Button>
          </View>
        </View>

        {/* STT */}
        <View className="bg-card border-border gap-3 rounded-2xl border p-4">
          <Text className="text-foreground text-lg font-semibold">Dictée (STT · Deepgram)</Text>
          <Text className="text-muted-foreground text-sm">
            Enregistre puis transcris ta voix.
          </Text>
          <Button
            onPress={onMic}
            disabled={stt.transcribing}
            variant={stt.isRecording ? 'destructive' : 'default'}>
            <Text>
              {stt.isRecording ? 'Stop + transcrire' : stt.transcribing ? 'Transcription…' : 'Parler'}
            </Text>
          </Button>
          <Text className="text-foreground text-base">
            {stt.transcribing
              ? 'Transcription…'
              : transcript || 'Appuie sur Parler, dis une phrase, puis arrête.'}
          </Text>
          {stt.error ? <Text className="text-destructive text-sm">{stt.error}</Text> : null}
        </View>
      </ScrollView>
    </View>
  );
}
