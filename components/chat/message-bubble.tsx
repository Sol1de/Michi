import { Sparkles } from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { speak } from '@/lib/speak';
import type { ChatMessage } from '@/hooks/use-groq-chat';

function AiAvatar() {
  return (
    <View className="bg-accent mt-1 size-8 items-center justify-center rounded-full">
      <Icon as={Sparkles} size={16} className="text-primary-foreground" />
    </View>
  );
}

export function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <View className="mb-3 w-full items-end">
        <View className="bg-secondary max-w-[85%] rounded-2xl rounded-tr-sm px-4 py-3">
          <Text className="text-secondary-foreground text-base leading-6">{message.content}</Text>
        </View>
      </View>
    );
  }

  // AI bubble — tap to hear it read aloud (TTS).
  return (
    <View className="mb-3 w-full flex-row items-start gap-2">
      <AiAvatar />
      <Pressable
        onPress={() => speak(message.content)}
        accessibilityLabel="Lire la réponse à voix haute"
        className="bg-card max-w-[82%] rounded-2xl rounded-tl-sm px-4 py-3 active:opacity-80">
        <Text className="text-card-foreground text-base leading-6">{message.content}</Text>
      </Pressable>
    </View>
  );
}
