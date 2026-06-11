import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Platform, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatEmptyState } from '@/components/chat/chat-empty-state';
import { ChatInput } from '@/components/chat/chat-input';
import { useChat } from '@/components/chat/chat-provider';
import { MessageBubble } from '@/components/chat/message-bubble';
import { MichiHeader } from '@/components/michi-header';
import { Text } from '@/components/ui/text';
import { MICHI } from '@/constants/theme';

export default function ChatScreen() {
  const { messages, loading, error, send, title } = useChat();
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Drive the input's bottom offset from real keyboard events instead of
  // KeyboardAvoidingView — on Android edge-to-edge the latter reports a
  // phantom keyboard height (= nav bar inset) when closed, leaving a gap.
  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const show = Keyboard.addListener(showEvt, (e) => setKeyboardHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener(hideEvt, () => setKeyboardHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const visible = messages.filter((m) => m.role !== 'system');
  const isEmpty = visible.length === 0 && !loading;
  const bottomPad = (keyboardHeight > 0 ? keyboardHeight : insets.bottom) + 8;

  return (
    <View className="bg-background flex-1">
      <MichiHeader title={title} />

      {isEmpty ? (
        <ChatEmptyState />
      ) : (
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ padding: 16 }}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}>
          {visible.map((m, i) => (
            <MessageBubble key={i} message={m} />
          ))}
          {loading ? <ActivityIndicator color={MICHI.primary} style={{ marginTop: 8 }} /> : null}
        </ScrollView>
      )}

      {error ? <Text className="text-destructive px-4 pb-1 text-sm">{error}</Text> : null}

      <View style={{ paddingBottom: bottomPad }} className="px-3 pt-2">
        <ChatInput onSend={send} disabled={loading} />
      </View>
    </View>
  );
}
