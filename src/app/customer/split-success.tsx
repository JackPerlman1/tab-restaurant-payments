import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

const C = {
  navy: '#0B1426',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  green: '#30D158',
};

function CheckIcon() {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withDelay(200, withSpring(1, { damping: 12, stiffness: 100 }));
  }, []);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (Platform.OS === 'ios') {
    return (
      <Animated.View style={anim}>
        <SymbolView
          name="checkmark.circle.fill"
          tintColor={C.green}
          style={{ width: 88, height: 88 }}
        />
      </Animated.View>
    );
  }
  return (
    <Animated.View style={[styles.checkCircle, anim]}>
      <Text style={styles.checkMark}>✓</Text>
    </Animated.View>
  );
}

export default function SplitSuccessScreen() {
  const { perPerson, people } = useLocalSearchParams<{
    perPerson: string;
    people: string;
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
      <View style={styles.content}>
        <CheckIcon />

        <Animated.View style={[styles.textBlock, textStyle]}>
          <Text style={styles.headline}>Split Complete</Text>
          <Text style={styles.tagline}>Enjoy the rest of your day</Text>
        </Animated.View>

        <Animated.View style={[styles.shareCard, textStyle]}>
          <Text style={styles.shareNote}>Your share ({people} people)</Text>
          <Text style={styles.shareAmount}>${perPerson}</Text>
          <Text style={styles.shareIncludes}>includes 20% tip</Text>
        </Animated.View>
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
  shareCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 4,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  shareNote: {
    fontSize: 13,
    color: C.whiteDim,
    fontWeight: '500',
    marginBottom: 4,
  },
  shareAmount: {
    fontSize: 52,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -2,
  },
  shareIncludes: {
    fontSize: 12,
    color: C.whiteDim,
    marginTop: 2,
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
