import { DrawerActions } from '@react-navigation/native';
import { useNavigation, useRouter } from 'expo-router';
import { Menu, Settings, type LucideIcon } from 'lucide-react-native';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';

type HeaderAction = {
  icon: LucideIcon;
  onPress: () => void;
  label: string;
};

export function MichiHeader({
  title,
  left,
  right,
}: {
  title: string;
  left?: HeaderAction;
  right?: HeaderAction | null;
}) {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const router = useRouter();

  const leftAction: HeaderAction = left ?? {
    icon: Menu,
    label: 'Ouvrir le menu',
    onPress: () => navigation.dispatch(DrawerActions.openDrawer()),
  };

  const rightAction =
    right === null
      ? null
      : (right ?? {
          icon: Settings,
          label: 'Réglages',
          onPress: () => router.push('/settings'),
        });

  return (
    <View
      style={{ paddingTop: insets.top }}
      className="border-border/60 bg-background border-b">
      <View className="h-14 flex-row items-center justify-between px-2">
        <Button variant="ghost" size="icon" onPress={leftAction.onPress} accessibilityLabel={leftAction.label}>
          <Icon as={leftAction.icon} size={22} className="text-muted-foreground" />
        </Button>

        <Text numberOfLines={1} className="flex-1 text-center text-base font-semibold">
          {title}
        </Text>

        {rightAction ? (
          <Button
            variant="ghost"
            size="icon"
            onPress={rightAction.onPress}
            accessibilityLabel={rightAction.label}>
            <Icon as={rightAction.icon} size={20} className="text-muted-foreground" />
          </Button>
        ) : (
          <View className="h-10 w-10" />
        )}
      </View>
    </View>
  );
}
