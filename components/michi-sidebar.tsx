import { DrawerContentScrollView, type DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import {
  BookOpen,
  Briefcase,
  History,
  MessageCircle,
  Plane,
  Plus,
  User,
  type LucideIcon,
} from 'lucide-react-native';
import { Pressable, View } from 'react-native';

import { useChat } from '@/components/chat/chat-provider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';

type Category = { key: string; label: string; icon: LucideIcon; items: string[] };

// Demo thématiques mirroring the mockup. Conversation history isn't persisted —
// selecting an item sets the header title and opens the (single) chat screen.
const CATEGORIES: Category[] = [
  { key: 'voyage', label: 'Voyage', icon: Plane, items: ['Hôtel à Tokyo', 'Billets de train'] },
  { key: 'travail', label: 'Travail', icon: Briefcase, items: ["Réunion d'équipe", 'Email professionnel'] },
  {
    key: 'conversation',
    label: 'Conversation quotidienne',
    icon: MessageCircle,
    items: ['Météo', 'Au restaurant'],
  },
  { key: 'grammaire', label: 'Grammaire N3', icon: BookOpen, items: ['Les particules', 'Le keigo'] },
];

const DEFAULT_OPEN = ['voyage', 'conversation'];

export function MichiSidebar(props: DrawerContentComponentProps) {
  const router = useRouter();
  const { title, setTitle, newThematique } = useChat();

  const open = (thematique: string) => {
    setTitle(thematique);
    router.navigate('/');
    props.navigation.closeDrawer();
  };

  const startNew = () => {
    newThematique();
    router.navigate('/');
    props.navigation.closeDrawer();
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{ paddingTop: 0 }}
      className="bg-background">
      {/* Profile */}
      <View className="flex-row items-center gap-3 px-4 pb-4 pt-2">
        <Avatar alt="Apprenant Michi" className="size-12">
          <AvatarFallback className="bg-accent">
            <Icon as={User} size={22} className="text-primary-foreground" />
          </AvatarFallback>
        </Avatar>
        <View className="flex-1">
          <Text className="text-foreground text-base font-semibold">Apprenant Michi</Text>
          <Text className="text-muted-foreground text-sm">Objectif JLPT N2</Text>
        </View>
      </View>

      {/* New thématique */}
      <View className="px-4 pb-2">
        <Button onPress={startNew} className="h-11 rounded-2xl">
          <Icon as={Plus} size={18} className="text-primary-foreground" />
          <Text>Nouvelle thématique</Text>
        </Button>
      </View>

      {/* Categories */}
      <Accordion type="multiple" defaultValue={DEFAULT_OPEN} className="px-2">
        {CATEGORIES.map((cat) => (
          <AccordionItem key={cat.key} value={cat.key} className="border-b-0">
            <AccordionTrigger className="px-2">
              <View className="flex-row items-center gap-3">
                <Icon as={cat.icon} size={18} className="text-muted-foreground" />
                <Text className="text-foreground text-sm font-medium">{cat.label}</Text>
              </View>
            </AccordionTrigger>
            <AccordionContent className="pb-1">
              {cat.items.map((item) => {
                const active = item === title;
                return (
                  <Pressable
                    key={item}
                    onPress={() => open(item)}
                    className="flex-row items-center gap-2 rounded-lg py-2 pl-11 pr-3 active:opacity-70">
                    {active ? <View className="bg-primary size-1.5 rounded-full" /> : null}
                    <Text
                      className={
                        active ? 'text-foreground text-sm font-medium' : 'text-muted-foreground text-sm'
                      }>
                      {item}
                    </Text>
                  </Pressable>
                );
              })}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Separator className="bg-border/50 my-2" />

      {/* Archives (presentational) */}
      <Pressable
        onPress={() => open('Archives')}
        className="mx-4 flex-row items-center gap-3 rounded-lg px-2 py-3 active:opacity-70">
        <Icon as={History} size={18} className="text-muted-foreground" />
        <Text className="text-foreground text-sm font-medium">Archives</Text>
      </Pressable>
    </DrawerContentScrollView>
  );
}
