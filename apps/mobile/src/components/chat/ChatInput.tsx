import React, { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Send } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii } from '../../theme/spacing';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSend(trimmed);
    setText('');
  }, [text, disabled, onSend]);

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={text}
            onChangeText={setText}
            placeholder="Type a message..."
            placeholderTextColor={colors.ash}
            multiline
            maxLength={1000}
            editable={!disabled}
            selectionColor={colors.turmeric.DEFAULT}
          />
          <Pressable
            onPress={handleSend}
            disabled={!canSend}
            style={[styles.sendButton, canSend && styles.sendButtonActive]}
          >
            <Send size={20} color={canSend ? colors.white : colors.ash} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.mist,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    ...typography.body,
    color: colors.charcoal,
    backgroundColor: colors.cloud,
    borderRadius: radii['2xl'],
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.mist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonActive: {
    backgroundColor: colors.turmeric.DEFAULT,
  },
});
