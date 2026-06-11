import { MessagesSquare } from 'lucide-react-native';
import { View } from 'react-native';

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

export function ChatEmptyState() {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <View className="bg-card/80 mb-6 size-20 items-center justify-center rounded-full">
        <Icon as={MessagesSquare} size={30} className="text-primary" />
      </View>
      <Text className="text-foreground text-center text-2xl font-bold leading-8">
        Bonjour ! Je suis Michi,{'\n'}ton compagnon d&apos;étude.
      </Text>
      <Text className="text-muted-foreground mt-3 text-center text-base leading-6">
        De quoi souhaites-tu discuter aujourd&apos;hui en japonais ?
      </Text>
    </View>
  );
}
