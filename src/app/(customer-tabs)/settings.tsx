import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { ChevronRight } from '@/components/card-brand';
import { useAuth } from '@/context/auth';
import { useTab } from '@/context/tab';
import { resetOnboarding } from '@/utils/demo';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  border: 'rgba(255,255,255,0.07)',
  red: '#FF453A',
};

function SettingsRow({
  label,
  onPress,
  destructive = false,
}: {
  label: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.row} activeOpacity={0.65} onPress={onPress}>
      <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>{label}</Text>
      {!destructive && <ChevronRight />}
    </TouchableOpacity>
  );
}

export default function CustomerSettingsScreen() {
  const { user, logout } = useAuth();
  const { resetDemoData } = useTab();
  const name = user?.type === 'customer' ? user.name : '';

  const handleLogout = () => {
    logout();
  };

  const handleReset = () => {
    resetDemoData();
    resetOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(80).duration(600).springify()} style={styles.headerBlock}>
          <Text style={styles.title}>Settings</Text>
          {name ? <Text style={styles.nameLabel}>{name}</Text> : null}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(180).duration(600).springify()} style={styles.section}>
          <Text style={styles.sectionHeader}>Account</Text>
          <View style={styles.card}>
            <SettingsRow
              label="Payment Methods"
              onPress={() => router.push('/customer/payment-methods')}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(280).duration(600).springify()} style={styles.section}>
          <View style={styles.card}>
            <SettingsRow label="Log Out" onPress={handleLogout} destructive />
          </View>
        </Animated.View>

        {/* Reset demo data — hidden at bottom */}
        <Animated.View entering={FadeInDown.delay(360).duration(500)} style={styles.resetSection}>
          <TouchableOpacity style={styles.resetBtn} activeOpacity={0.6} onPress={handleReset}>
            <Text style={styles.resetText}>Reset Demo Data</Text>
          </TouchableOpacity>
        </Animated.View>
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
    paddingBottom: 40,
  },
  headerBlock: {
    paddingTop: 8,
    marginBottom: 32,
    gap: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  nameLabel: {
    fontSize: 14,
    color: C.whiteDim,
    fontWeight: '400',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  card: {
    backgroundColor: C.navyCard,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: C.white,
  },
  rowLabelDestructive: {
    color: C.red,
    fontWeight: '500',
  },
  resetSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  resetBtn: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.22)',
    letterSpacing: 0.3,
  },
});
