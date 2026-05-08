import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../src/theme/colors';
import { typography } from '../src/theme/typography';
import { spacing, radii } from '../src/theme/spacing';
import { PhoneInput } from '../src/components/ui/Input';
import { Button } from '../src/components/ui/Button';
import { useUIStore } from '../src/store/ui-store';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addToast = useUIStore((s) => s.addToast);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOTP = useCallback(async () => {
    const cleaned = phone.replace(/\s/g, '');
    if (cleaned.length < 10) {
      addToast('error', 'Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    try {
      // In production, this triggers Firebase phone auth
      // For now, navigate to verify with the phone number
      const fullPhone = cleaned.startsWith('+91') ? cleaned : `+91${cleaned}`;
      router.push({ pathname: '/verify', params: { phone: fullPhone } });
    } catch {
      addToast('error', 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [phone, router, addToast]);

  return (
    <LinearGradient
      colors={[colors.turmeric.light, colors.cloud, colors.white]}
      locations={[0, 0.4, 1]}
      style={styles.gradient}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={[styles.container, { paddingTop: insets.top + spacing['4xl'] }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brand}>GharKa</Text>
            <Text style={styles.tagline}>Homemade food from{'\n'}your neighborhood</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>Get Started</Text>
            <Text style={styles.formSubtitle}>
              Enter your phone number to continue
            </Text>

            <PhoneInput
              label="Phone Number"
              placeholder="98765 43210"
              value={phone}
              onChangeText={setPhone}
              maxLength={12}
            />

            <Button
              title="Send OTP"
              onPress={handleSendOTP}
              loading={loading}
              disabled={phone.replace(/\s/g, '').length < 10}
              fullWidth
              size="lg"
            />
          </View>

          {/* Footer */}
          <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
            <Text style={styles.disclaimer}>
              By continuing, you agree to GharKa's Terms of Service and Privacy Policy.
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
  },
  header: {
    marginBottom: spacing['4xl'],
  },
  brand: {
    ...typography.display,
    color: colors.turmeric.DEFAULT,
    fontSize: 42,
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.h2,
    color: colors.charcoal,
    lineHeight: 28,
  },
  form: {
    flex: 1,
  },
  formTitle: {
    ...typography.h1,
    color: colors.charcoal,
    marginBottom: spacing.xs,
  },
  formSubtitle: {
    ...typography.body,
    color: colors.slate,
    marginBottom: spacing['2xl'],
  },
  footer: {
    alignItems: 'center',
  },
  disclaimer: {
    ...typography.bodySmall,
    color: colors.ash,
    textAlign: 'center',
    lineHeight: 17,
  },
});
