import * as LocalAuthentication from 'expo-local-authentication';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';
import { useFocusEffect } from 'expo-router';

import { useAuth } from '@/context/auth';
import { fmt, useTab } from '@/context/tab';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  navyMid: '#162240',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  whiteFaint: 'rgba(255,255,255,0.12)',
  border: 'rgba(255,255,255,0.07)',
  gold: '#C9A84C',
};

function generateMemberId(email: string): string {
  let h = 0;
  for (let i = 0; i < email.length; i++) {
    h = (Math.imul(31, h) + email.charCodeAt(i)) | 0;
  }
  return String((Math.abs(h) % 900000) + 100000);
}

function LockIcon({ size = 22, color = C.white }: { size?: number; color?: string }) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name="lock.fill"
        tintColor={color as string}
        style={{ width: size, height: size }}
      />
    );
  }
  return <Text style={{ fontSize: size, color }}>🔒</Text>;
}

function FaceIdIcon({ size = 32, color = C.white }: { size?: number; color?: string }) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name="faceid"
        tintColor={color as string}
        style={{ width: size, height: size }}
      />
    );
  }
  return <Text style={{ fontSize: size, color }}>🔐</Text>;
}

export default function CustomerHome() {
  const { user } = useAuth();
  const { openTab } = useTab();

  const name = user?.type === 'customer' ? user.name : '';
  const email = user?.type === 'customer' ? user.email : '';
  const memberId = generateMemberId(email);

  const [locked, setLocked] = useState(true);
  const hasAttempted = useRef(false);
  const revealProgress = useSharedValue(0);

  const unlock = useCallback(() => {
    setLocked(false);
    revealProgress.value = withSpring(1, { damping: 18, stiffness: 120 });
  }, [revealProgress]);

  const authenticate = useCallback(async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!hasHardware || !isEnrolled) {
        unlock();
        return;
      }
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate to view your Member ID',
        fallbackLabel: 'Use Passcode',
      });
      if (result.success) unlock();
    } catch {
      unlock();
    }
  }, [unlock]);

  // Auto-prompt once per focus
  useFocusEffect(
    useCallback(() => {
      setLocked(true);
      revealProgress.value = 0;
      hasAttempted.current = false;
    }, [revealProgress])
  );

  useEffect(() => {
    if (!hasAttempted.current) {
      hasAttempted.current = true;
      authenticate();
    }
  }, [authenticate]);

  const idStyle = useAnimatedStyle(() => ({
    opacity: revealProgress.value,
    transform: [{ scale: interpolate(revealProgress.value, [0, 1], [0.96, 1]) }],
  }));

  const lockOverlayStyle = useAnimatedStyle(() => ({
    opacity: interpolate(revealProgress.value, [0, 0.5], [1, 0]),
    pointerEvents: locked ? 'auto' : 'none',
  }));

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Greeting */}
        <View style={styles.greeting}>
          <Text style={styles.greetingText}>Good evening,</Text>
          <Text style={styles.greetingName}>{name}</Text>
        </View>

        {/* Member ID Card */}
        <TouchableOpacity
          activeOpacity={locked ? 0.8 : 1}
          onPress={locked ? authenticate : undefined}
          style={styles.memberCard}>

          {/* Revealed content */}
          <Animated.View style={[styles.memberCardInner, idStyle]}>
            <View style={styles.memberCardTop}>
              <Text style={styles.memberLabel}>MEMBER ID</Text>
              <LockIcon size={14} color="rgba(255,255,255,0.35)" />
            </View>
            <Text style={styles.memberId}>{memberId}</Text>
            <Text style={styles.memberName}>{name}</Text>
          </Animated.View>

          {/* Lock overlay */}
          <Animated.View style={[StyleSheet.absoluteFill, styles.lockOverlay, lockOverlayStyle]}>
            <FaceIdIcon size={34} color="rgba(255,255,255,0.70)" />
            <Text style={styles.lockTitle}>Tap to reveal</Text>
            <Text style={styles.lockSub}>your Member ID</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* Open tab preview */}
        {openTab ? (
          <View style={styles.tabSection}>
            <View style={styles.tabHeader}>
              <View style={styles.tabDot} />
              <Text style={styles.tabSectionLabel}>OPEN TAB</Text>
            </View>

            <View style={styles.tabCard}>
              <View style={styles.tabCardTop}>
                <Text style={styles.tabRestaurant}>{openTab.restaurantName}</Text>
                <Text style={styles.tabTableNum}>Table {openTab.tableNumber}</Text>
              </View>
              <Text style={styles.tabOpenedAt}>Opened at {openTab.openedAt}</Text>

              <View style={styles.tabDivider} />

              {openTab.items.map((item) => (
                <View key={item.id} style={styles.tabItemRow}>
                  <Text style={styles.tabItemName} numberOfLines={1}>
                    {item.quantity > 1 ? `${item.quantity}× ` : ''}{item.name}
                  </Text>
                  <Text style={styles.tabItemPrice}>${fmt(item.price * item.quantity)}</Text>
                </View>
              ))}

              <View style={styles.tabDivider} />

              <View style={styles.tabTotal}>
                <Text style={styles.tabTotalLabel}>Running Total</Text>
                <Text style={styles.tabTotalAmount}>${fmt(openTab.total)}</Text>
              </View>

              <TouchableOpacity
                style={styles.viewTabBtn}
                activeOpacity={0.75}
                onPress={() => router.push('/(customer-tabs)/active-tab')}>
                <Text style={styles.viewTabText}>View Full Tab</Text>
                <Text style={styles.viewTabArrow}>→</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noTab}>
            <Text style={styles.noTabText}>No open tab</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.navy,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  greeting: {
    paddingTop: 8,
    marginBottom: 24,
    gap: 2,
  },
  greetingText: {
    fontSize: 14,
    color: C.whiteDim,
    fontWeight: '400',
  },
  greetingName: {
    fontSize: 26,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.4,
  },
  // Member ID Card
  memberCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 160,
    marginBottom: 28,
    experimental_backgroundImage: 'linear-gradient(145deg, #1E3358 0%, #0B1A2E 100%)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  } as any,
  memberCardInner: {
    flex: 1,
    paddingHorizontal: 22,
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  memberCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.45)',
    letterSpacing: 1.8,
  },
  memberId: {
    fontSize: 40,
    fontWeight: '700',
    color: C.white,
    letterSpacing: 6,
    alignSelf: 'center',
  },
  memberName: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  // Lock overlay
  lockOverlay: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(11,20,38,0.55)',
  },
  lockTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
  lockSub: {
    fontSize: 13,
    color: C.whiteDim,
    marginTop: -4,
  },
  // Open tab section
  tabSection: {
    gap: 10,
  },
  tabHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 4,
  },
  tabDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#30D158',
  },
  tabSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.2,
  },
  tabCard: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: C.border,
  },
  tabCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  tabRestaurant: {
    fontSize: 18,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.2,
  },
  tabTableNum: {
    fontSize: 13,
    color: C.whiteDim,
    fontWeight: '500',
  },
  tabOpenedAt: {
    fontSize: 12,
    color: C.whiteDim,
    marginBottom: 12,
  },
  tabDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
    marginVertical: 12,
  },
  tabItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 3,
  },
  tabItemName: {
    flex: 1,
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '400',
    marginRight: 12,
  },
  tabItemPrice: {
    fontSize: 14,
    color: C.white,
    fontWeight: '500',
  },
  tabTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  tabTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: C.white,
  },
  tabTotalAmount: {
    fontSize: 20,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.3,
  },
  viewTabBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    paddingVertical: 12,
  },
  viewTabText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.white,
  },
  viewTabArrow: {
    fontSize: 14,
    color: C.whiteDim,
  },
  noTab: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  noTabText: {
    fontSize: 15,
    color: C.whiteDim,
  },
});
