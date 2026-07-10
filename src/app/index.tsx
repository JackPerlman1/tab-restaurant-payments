import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { OnboardingCarousel } from '@/components/onboarding';
import { isOnboardingDone, markOnboardingDone } from '@/utils/demo';

const C = {
  navy: '#0B1426',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  border: 'rgba(255,255,255,0.14)',
};

export default function WelcomeScreen() {
  const [showOnboarding, setShowOnboarding] = useState(!isOnboardingDone());

  if (showOnboarding) {
    return (
      <OnboardingCarousel
        onDone={() => {
          markOnboardingDone();
          setShowOnboarding(false);
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Animated.Text entering={FadeInDown.delay(150).duration(900).springify()} style={styles.logo}>
          Tab
        </Animated.Text>

        <Animated.View entering={FadeIn.delay(750).duration(700)} style={styles.taglineRow}>
          <View style={styles.divider} />
          <Text style={styles.tagline}>Eat. Tip. Leave.</Text>
        </Animated.View>
      </View>

      <Animated.View entering={FadeInDown.delay(1050).duration(700).springify()} style={styles.actions}>
        <TouchableOpacity
          style={styles.btnPrimary}
          activeOpacity={0.85}
          onPress={() => router.push('/customer/login')}>
          <Text style={styles.btnPrimaryText}>I'm a Customer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btnGhost}
          activeOpacity={0.75}
          onPress={() => router.push('/restaurant/login')}>
          <Text style={styles.btnGhostText}>I'm a Restaurant</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.navy,
    paddingHorizontal: 28,
    paddingBottom: 16,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 28,
  },
  logo: {
    fontSize: 88,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -4,
  },
  taglineRow: {
    alignItems: 'center',
    gap: 18,
  },
  divider: {
    width: 36,
    height: 1,
    backgroundColor: C.border,
  },
  tagline: {
    fontSize: 12,
    letterSpacing: 4,
    color: C.whiteDim,
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  actions: {
    gap: 12,
    paddingBottom: 8,
  },
  btnPrimary: {
    backgroundColor: C.white,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: C.navy,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  btnGhost: {
    borderWidth: 1.5,
    borderColor: C.border,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnGhostText: {
    color: C.white,
    fontSize: 16,
    fontWeight: '500',
    letterSpacing: 0.1,
  },
});
