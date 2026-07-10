import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fmt, useTab } from '@/context/tab';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  border: 'rgba(255,255,255,0.07)',
};

const DEFAULT_TIP_RATE = 0.20;

export default function SplitScreen() {
  const { openTab, splitPeople, setSplitPeople, tableCode } = useTab();

  useEffect(() => {
    if (!openTab) router.back();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!openTab) return null;

  const { subtotal, tax, total } = openTab;
  const tipAmount = subtotal * DEFAULT_TIP_RATE;
  const totalWithTip = total + tipAmount;
  const perPerson = totalWithTip / splitPeople;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(60).duration(600).springify()}>
          <Text style={styles.title}>Split with Friends</Text>
          <Text style={styles.subtitle}>Share the code — everyone pays their share</Text>
        </Animated.View>

        {/* People count stepper */}
        <Animated.View entering={FadeInDown.delay(160).duration(600).springify()} style={styles.card}>
          <Text style={styles.cardLabel}>NUMBER OF PEOPLE</Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, splitPeople <= 2 && styles.stepBtnDisabled]}
              onPress={() => splitPeople > 2 && setSplitPeople(splitPeople - 1)}>
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.stepCount}>{splitPeople}</Text>
            <TouchableOpacity
              style={[styles.stepBtn, splitPeople >= 8 && styles.stepBtnDisabled]}
              onPress={() => splitPeople < 8 && setSplitPeople(splitPeople + 1)}>
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Table code */}
        <Animated.View entering={FadeInDown.delay(240).duration(600).springify()} style={styles.codeSection}>
          <Text style={styles.codeLabel}>TABLE CODE</Text>
          <View style={styles.codeCard}>
            <Text style={styles.code}>{tableCode}</Text>
          </View>
          <Text style={styles.codeInstruction}>
            Friends open Tab and enter this code to join your table
          </Text>
        </Animated.View>

        {/* Per person breakdown */}
        <Animated.View entering={FadeInDown.delay(310).duration(600).springify()} style={styles.card}>
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>Bill total</Text>
            <Text style={styles.breakdownValue}>${fmt(total)}</Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>20% tip</Text>
            <Text style={styles.breakdownValue}>${fmt(tipAmount)}</Text>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <Text style={styles.breakdownLabel}>{splitPeople} people</Text>
            <View style={styles.perPersonBadge}>
              <Text style={styles.perPersonLabel}>each</Text>
              <Text style={styles.perPersonAmount}>${fmt(perPerson)}</Text>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(380).duration(600).springify()} style={styles.btnRow}>
          <TouchableOpacity
            style={styles.btnPrimary}
            activeOpacity={0.85}
            onPress={() =>
              router.push({
                pathname: '/customer/split-waiting',
                params: {
                  people: String(splitPeople),
                  perPerson: fmt(perPerson),
                  tableCode,
                },
              })
            }>
            <Text style={styles.btnPrimaryText}>View Table Status</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.navy,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 20,
  },
  back: {
    paddingTop: 8,
    paddingBottom: 20,
    alignSelf: 'flex-start',
  },
  backText: {
    color: C.whiteDim,
    fontSize: 15,
    fontWeight: '500',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: C.whiteDim,
    marginBottom: 28,
  },
  card: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnDisabled: {
    opacity: 0.3,
  },
  stepBtnText: {
    color: C.white,
    fontSize: 22,
    fontWeight: '300',
    lineHeight: 26,
  },
  stepCount: {
    fontSize: 42,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -1,
    minWidth: 56,
    textAlign: 'center',
  },
  codeSection: {
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  codeLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.5,
  },
  codeCard: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  code: {
    fontSize: 56,
    fontWeight: '700',
    color: C.white,
    letterSpacing: 12,
  },
  codeInstruction: {
    fontSize: 13,
    color: C.whiteDim,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  breakdownLabel: {
    fontSize: 15,
    color: C.whiteDim,
  },
  breakdownValue: {
    fontSize: 15,
    color: C.white,
    fontWeight: '500',
  },
  breakdownDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
  },
  perPersonBadge: {
    alignItems: 'flex-end',
    gap: 1,
  },
  perPersonLabel: {
    fontSize: 11,
    color: C.whiteDim,
    fontWeight: '500',
  },
  perPersonAmount: {
    fontSize: 22,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.4,
  },
  btnRow: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: 16,
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
});
