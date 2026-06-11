import { Drawer } from 'expo-router/drawer';

import { ChatProvider } from '@/components/chat/chat-provider';
import { MichiSidebar } from '@/components/michi-sidebar';
import { MICHI } from '@/constants/theme';

export default function DrawerLayout() {
  return (
    <ChatProvider>
      <Drawer
        drawerContent={(props) => <MichiSidebar {...props} />}
        screenOptions={{
          headerShown: false,
          drawerType: 'front',
          drawerStyle: { backgroundColor: MICHI.background, width: 320 },
        }}>
        <Drawer.Screen name="index" />
        <Drawer.Screen name="settings" />
      </Drawer>
    </ChatProvider>
  );
}
