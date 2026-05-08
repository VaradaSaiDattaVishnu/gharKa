import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, radii } from '../src/theme/spacing';
import { Button } from '../src/components/ui/Button';
import { useAuthStore, persistUser } from '../src/store/auth-store';
import { setTokens } from '../src/lib/api-client';
import { authApi } from '../src/hooks/use-api';
import { useUIStore } from '../src/store/ui-store';

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 30;

export default function VerifyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { phone } = useLocalSearchParams<{ phone: string }>();
  const { setUser, setAuthenticated, setOnboarded } = useAuthStore();
  const addToast = useUIStore((s) => s.addToast);

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_COOLDOWN);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Auto-focus first input
    inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = useCallback(
    (text: string, index: number) => {
      const newOtp = [...otp];

      if (text.length > 1) {
        // Handle paste
        const digits = text.replace(/\D/g, '').slice(0, OTP_LENGTH);
        for (let i = 0; i < OTP_LENGTH; i++) {
          newOtp[i] = digits[i] ?? '';
        }
        setOtp(newOtp);
        const lastFilledIndex = Math.min(digits.length, OTP_LENGTH) - 1;
        inputRefs.current[lastFilledIndex]?.focus();

        if (digits.length === OTP_LENGTH) {
          handleSubmit(newOtp.join(''));
        }
        return;
      }

      newOtp[index] = text;
      setOtp(newOtp);

      if (text && index < OTP_LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      if (text && index === OTP_LENGTH - 1) {
        const code = newOtp.join('');
        if (code.length === OTP_LENGTH) {
          handleSubmit(code);
        }
      }
    },
    [otp]
  );

  const handleKeyPress = useCallback(
    (key: string, index: number) => {
      if (key === 'Backspace' && !otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handleSubmit = useCallback(
    async (code: string) => {
      if (code.length !== OTP_LENGTH || loading) return;
      setLoading(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      try {
        // In production, verify with Firebase and get firebaseToken
        // For dev, use the OTP code as a mock token
        const api = authApi();
        const result = await api.verifyFirebase(code);

        await setTokens({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        });

        const user = result.data.user;
        await persistUser(user);
        setUser(user);
        setAuthenticated(true);

        if (user.name) {
          setOnboarded(true);
          router.replace('/(tabs)/feed');
        } else {
          router.replace('/onboard');
        }
      } catch (err: any) {
        addToast('error', err?.message ?? 'Verification failed. Please try again.');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } finally {
        setLoading(false);
      }
    },
    [loading, setUser, setAuthenticated, setOnboarded, router, addToast]
  );

  const handleResend = useCallback(() => {
    if (resendTimer > 0) return;
    setResendTimer(RESEND_COOLDOWN);
    Haptics.selectionAsync();
    addToast('info', 'OTP resent to your phone');
  }, [resendTimer, addToast]);

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.lg }]}>
      {/* Back button */}
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <ChevronLeft size={24} color={colors.charcoal} />
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Verify Phone</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{'\n'}
          <Text style={styles.phone}>{phone ?? 'your phone'}</Text>
        </Text>

        {/* OTP Input */}
        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : undefined,
              ]}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
              keyboardType="number-pad"
              maxLength={index === 0 ? OTP_LENGTH : 1}
              selectionColor={colors.turmeric.DEFAULT}
              textContentType="oneTimeCode"
              autoComplete={index === 0 ? 'one-time-code' : undefined}
            />
          ))}
        </View>

        {/* Resend */}
        <View style={styles.resendRow}>
          <Text style={styles.resendLabel}>Didn't receive the code? </Text>
          <Pressable onPress={handleResend} disabled={resendTimer > 0}>
            <Text
              style={[
                styles.resendButton,
                resendTimer > 0 && styles.resendDisabled,
              ]}
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend'}
            </Text>
          </Pressable>
        </View>

        <Button
          title="Verify"
          onPress={() => handleSubmit(otp.join(''))}
          loading={loading}
          disabled={otp.join('').length !== OTP_LENGTH}
          fullWidth
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  backButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    alignSelf: 'flex-start',
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
  },
  title: {
    ...typography.h1,
    color: colors.charcoal,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.body,
    color: colors.slate,
    lineHeight: 22,
    marginBottom: spacing['3xl'],
  },
  phone: {
    fontFamily: 'Inter_600SemiBold',
    color: colors.charcoal,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing['2xl'],
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1.5,
    borderColor: colors.mist,
    borderRadius: radii.lg,
    textAlign: 'center',
    fontSize: 22,
    fontFamily: 'Nunito_700Bold',
    color: colors.charcoal,
    backgroundColor: colors.cloud,
  },
  otpInputFilled: {
    borderColor: colors.turmeric.DEFAULT,
    backgroundColor: colors.turmeric.light,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  resendLabel: {
    ...typography.body,
    color: colors.slate,
  },
  resendButton: {
    ...typography.body,
    fontFamily: 'Inter_600SemiBold',
    color: colors.turmeric.DEFAULT,
  },
  resendDisabled: {
    color: colors.ash,
  },
});
