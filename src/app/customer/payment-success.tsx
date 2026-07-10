import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo } from 'react';
import { Dimensions, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

const { width: SW, height: SH } = Dimensions.get('window');

const C = {
  navy: '#0B1426',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  green: '#30D158',
};

const CONFETTI_COLORS = ['#C9A84C', '#30D158', '#FFFFFF', '#5AC8FA', '#FF6B6B', '#FFD60A', '#BF5AF2'];
const PARTICLE_COUNT = 22;

type Particle = {
  finalX: number;
  peakY: number;
  fallY: number;
  finalRotation: number;
  delay: number;
  size: number;
  color: string;
  isCircle: boolean;
};

function ConfettiParticle({ p }: { p: Particle }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(p.delay, withSequence(
      withTiming(1, { duration: 50 }),
      withDelay(1000, withTiming(0, { duration: 450 })),
    ));
    tx.value = withDelay(p.delay, withTiming(p.finalX, { duration: 1500 }));
    ty.value = withDelay(p.delay, withSequence(
      withTiming(p.peakY, { duration: 520 }),
      withTiming(p.fallY, { duration: 980 }),
    ));
    rotation.value = withDelay(p.delay, withTiming(p.finalRotation, { duration: 1500 }));
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateX: tx.value },
      { translateY: ty.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: p.size,
          height: p.size,
          backgroundColor: p.color,
          borderRadius: p.isCircle ? p.size / 2 : 2,
          left: -(p.size / 2),
          top: -(p.size / 2),
        },
        style,
      ]}
    />
  );
}

function Confetti() {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
      const speed = 90 + (i % 5) * 38;
      return {
        finalX: Math.cos(angle) * speed,
        peakY: Math.sin(angle) * speed - 130,
        fallY: SH * 0.55,
        finalRotation: 240 + (i % 4) * 120,
        delay: 300 + (i % 6) * 45,
        size: 5 + (i % 4) * 3,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        isCircle: i % 3 !== 0,
      };
    });
  }, []);

  return (
    <View
      style={{
        position: 'absolute',
        top: SH * 0.3,
        left: SW / 2,
        width: 0,
        height: 0,
      }}
      pointerEvents="none">
      {particles.map((p, i) => (
        <ConfettiParticle key={i} p={p} />
      ))}
    </View>
  );
}

function CheckIcon() {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 100 }));
  }, []);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (Platform.OS === 'ios') {
    return (
      <Animated.View style={anim}>
        <SymbolView name="checkmark.circle.fill" tintColor={C.green} style={{ width: 88, height: 88 }} />
      </Animated.View>
    );
  }
  return (
    <Animated.View style={[styles.checkCircle, anim]}>
      <Text style={styles.checkMark}>✓</Text>
    </Animated.View>
  );
}

export default function PaymentSuccessScreen() {
  const { total, tip, restaurant } = useLocalSearchParams<{
    total: string;
    tip: string;
    restaurant: string;
  }>();

  const textOpacity = useSharedValue(0);
  const textY = useSharedValue(16);

  useEffect(() => {
    textOpacity.value = withDelay(550, withTiming(1, { duration: 500 }));
    textY.value = withDelay(550, withSpring(0, { damping: 16 }));
  }, []);

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textY.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <Confetti />

      <View style={styles.content}>
        <CheckIcon />

        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={styles.headline}>Tab Closed</Text>
          <Text style={styles.tagline}>Enjoy the rest of your day</Text>
        </Animated.View>

        {total && (
          <Animated.View style={[styles.receiptCard, textStyle]}>
            {restaurant && (
              <Text style={styles.receiptRestaurant} numberOfLines={1}>{restaurant}</Text>
            )}
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabel}>Tip</Text>
              <Text style={styles.receiptValue}>${tip}</Text>
            </View>
            <View style={styles.receiptDivider} />
            <View style={styles.receiptRow}>
              <Text style={styles.receiptLabelBold}>Total Paid</Text>
              <Text style={styles.receiptTotal}>${total}</Text>
            </View>
          </Animated.View>
        )}
      </View>

      <Animated.View style={[styles.footer, textStyle]}>
        <TouchableOpacity
          style={styles.doneBtn}
          activeOpacity={0.85}
          onPress={() => router.replace('/(customer-tabs)')}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.navy,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 28,
    gap: 28,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: C.green,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkMark: {
    fontSize: 48,
    color: C.white,
    fontWeight: '700',
  },
  textBlock: {
    alignItems: 'center',
    gap: 8,
  },
  headline: {
    fontSize: 30,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    color: C.whiteDim,
    fontWeight: '400',
  },
  receiptCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 18,
    width: '100%',
    gap: 2,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  receiptRestaurant: {
    fontSize: 13,
    color: C.whiteDim,
    fontWeight: '500',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  receiptLabel: {
    fontSize: 14,
    color: C.whiteDim,
  },
  receiptValue: {
    fontSize: 14,
    color: C.white,
    fontWeight: '500',
  },
  receiptDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(255,255,255,0.07)',
    marginVertical: 4,
  },
  receiptLabelBold: {
    fontSize: 15,
    color: C.white,
    fontWeight: '600',
  },
  receiptTotal: {
    fontSize: 18,
    color: C.white,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  doneBtn: {
    backgroundColor: C.white,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    color: C.navy,
    fontSize: 16,
    fontWeight: '700',
  },
});
