import { Mic, Send, Square } from 'lucide-react-native';
import { useState } from 'react';
import { ActivityIndicator, Pressable, TextInput, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { MICHI } from '@/constants/theme';
import { useSpeechToText } from '@/hooks/use-speech-to-text';

export function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
}) {
  const [text, setText] = useState('');
  const stt = useSpeechToText();

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    onSend(t);
    setText('');
  };

  // Mic toggles Deepgram STT — second tap stops and appends the transcript to the field.
  const toggleMic = async () => {
    if (stt.isRecording) {
      const transcript = await stt.stopAndTranscribe();
      if (transcript) setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
    } else {
      await stt.start();
    }
  };

  const canSend = !disabled && text.trim().length > 0;

  return (
    <View className="bg-card border-border flex-row items-end gap-1 rounded-3xl border px-2 py-1.5">
      <Pressable
        onPress={toggleMic}
        disabled={stt.transcribing}
        accessibilityLabel={stt.isRecording ? 'Arrêter la dictée' : 'Dicter au micro'}
        className="mb-0.5 size-9 items-center justify-center rounded-full active:opacity-70">
        {stt.transcribing ? (
          <ActivityIndicator size="small" color={MICHI.mutedForeground} />
        ) : (
          <Icon
            as={stt.isRecording ? Square : Mic}
            size={18}
            className={stt.isRecording ? 'text-destructive' : 'text-muted-foreground'}
          />
        )}
      </Pressable>

      <TextInput
        className="text-foreground min-h-9 flex-1 px-1 py-2 text-base"
        style={{ maxHeight: 120 }}
        value={text}
        onChangeText={setText}
        placeholder="Le savoir commence ici..."
        placeholderTextColor={MICHI.mutedForeground}
        multiline
        editable={!disabled}
      />

      <Pressable
        onPress={submit}
        disabled={!canSend}
        accessibilityLabel="Envoyer"
        style={{ opacity: canSend ? 1 : 0.5 }}
        className="bg-primary size-11 items-center justify-center rounded-full active:opacity-80">
        <Icon as={Send} size={18} className="text-primary-foreground" />
      </Pressable>
    </View>
  );
}
