import React, { useEffect } from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  SlideInUp,
  SlideOutUp,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radii, shadows } from '../../theme/spacing';
import { useUIStore, type ToastType } from '../../store/ui-store';

const iconMap: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle size={20} color={colors.coriander.DEFAULT} />,
  error: <AlertCircle size={20} color={colors.error} />,
  info: <Info size={20} color={colors.info} />,
  warning: <AlertTriangle size={20} color="#F57F17" />,
};

const bgMap: Record<ToastType, string> = {
  success: colors.coriander.light,
  error: '#FFEBEE',
  info: '#E3F2FD',
  warning: '#FFF8E1',
};

const textColorMap: Record<ToastType, string> = {
  success: colors.coriander.dark,
  error: colors.error,
  info: colors.info,
  warning: '#F57F17',
};

interface ToastItemProps {
  id: string;
  type: ToastType;
  message: string;
}

function ToastItem({ id, type, message }: ToastItemProps) {
  const removeToast = useUIStore((s) => s.removeToast);

  return (
    <Animated.View
      entering={SlideInUp.springify().damping(18).stiffness(200)}
      exiting={SlideOutUp.duration(200)}
      style={[styles.toast, { backgroundColor: bgMap[type] }]}
    >
      <Pressable onPress={() => removeToast(id)} style={styles.toastContent}>
        {iconMap[type]}
        <Text style={[styles.toastText, { color: textColorMap[type] }]} numberOfLines={2}>
          {message}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export function ToastContainer() {
  const insets = useSafeAreaInsets();
  const toasts = useUIStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <View style={[styles.container, { top: insets.top + spacing.sm }]} pointerEvents="box-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} id={toast.id} type={toast.type} message={toast.message} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 9999,
  },
  toast: {
    borderRadius: radii.lg,
    marginBottom: spacing.sm,
    ...shadows.md,
  },
  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.sm,
  },
  toastText: {
    ...typography.body,
    fontFamily: 'Inter_600SemiBold',
    flex: 1,
  },
});
