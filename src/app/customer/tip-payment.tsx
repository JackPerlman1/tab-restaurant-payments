import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
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

const TIP_OPTIONS = [
  { label: '18%', value: 0.18 },
  { label: '20%', value: 0.20 },
  { label: '25%', value: 0.25 },
  { label: '30%', value: 0.30 },
  { label: 'Custom', value: -1 },
];

export default function TipPaymentScreen() {
  const { openTab, closeTab } = useTab();
  const [selectedTip, setSelectedTip] = useState(0.20);
  const [isCustom, setIsCustom] = useState(false);
  const [customTip, setCustomTip] = useState('');

  useEffect(() => {
    if (!openTab) router.back();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!openTab) return null;

  const { restaurantName, subtotal, tax, total } = openTab;

  const tipAmount = isCustom
    ? parseFloat(customTip || '0')
    : subtotal * selectedTip;

  const tipPercent = isCustom
    ? Math.round((tipAmount / subtotal) * 100)
    : Math.round(selectedTip * 100);

  const finalTotal = total + tipAmount;

  const handlePay = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    closeTab(tipAmount, tipPercent);
    router.replace({
      pathname: '/customer/payment-success',
      params: { total: fmt(finalTotal), tip: fmt(tipAmount), restaurant: restaurantName },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.delay(60).duration(600).springify()}>
            <Text style={styles.title}>{restaurantName}</Text>
            <Text style={styles.subtitle}>Review &amp; tip</Text>
          </Animated.View>

          {/* Bill summary */}
          <Animated.View entering={FadeInDown.delay(140).duration(600).springify()} style={styles.card}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>${fmt(subtotal)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>${fmt(tax)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabelBold}>Total before tip</Text>
              <Text style={styles.summaryValueBold}>${fmt(total)}</Text>
            </View>
          </Animated.View>

          {/* Tip selector */}
          <Animated.View entering={FadeInDown.delay(220).duration(600).springify()} style={styles.tipSection}>
            <Text style={styles.tipTitle}>Add a tip</Text>
            <View style={styles.tipRow}>
              {TIP_OPTIONS.map((opt) => {
                const active = opt.value === -1 ? isCustom : (!isCustom && selectedTip === opt.value);
                return (
                  <TouchableOpacity
                    key={opt.label}
                    style={[styles.tipChip, active && styles.tipChipActive]}
                    activeOpacity={0.75}
                    onPress={() => {
                      if (opt.value === -1) {
                        setIsCustom(true);
                      } else {
                        setIsCustom(false);
                        setSelectedTip(opt.value);
                      }
                    }}>
                    <Text style={[styles.tipChipText, active && styles.tipChipTextActive]}>
                      {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {isCustom && (
              <View style={styles.customRow}>
                <Text style={styles.customDollar}>$</Text>
                <TextInput
                  style={styles.customInput}
                  value={customTip}
                  onChangeText={setCustomTip}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.30)"
                  keyboardType="decimal-pad"
                  autoFocus
                />
              </View>
            )}

            {tipAmount > 0 && (
              <View style={styles.tipAmountRow}>
                <Text style={styles.tipAmountLabel}>Tip amount</Text>
                <Text style={styles.tipAmountValue}>${fmt(tipAmount)}</Text>
              </View>
            )}
          </Animated.View>

          {/* Final total */}
          <Animated.View entering={FadeInDown.delay(300).duration(600).springify()} style={styles.finalCard}>
            <Text style={styles.finalLabel}>Total with tip</Text>
            <Text style={styles.finalAmount}>${fmt(finalTotal)}</Text>
          </Animated.View>
        </ScrollView>

        {/* Pay button */}
        <Animated.View entering={FadeInDown.delay(360).duration(600).springify()} style={styles.payRow}>
          <TouchableOpacity style={styles.payBtn} activeOpacity={0.85} onPress={handlePay}>
            <Text style={styles.payBtnText}>Pay &amp; Leave — ${fmt(finalTotal)}</Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: C.navy,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
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
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: C.whiteDim,
    marginBottom: 24,
  },
  card: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  summaryLabel: {
    fontSize: 15,
    color: C.whiteDim,
  },
  summaryValue: {
    fontSize: 15,
    color: C.white,
    fontWeight: '500',
  },
  summaryLabelBold: {
    fontSize: 15,
    color: C.white,
    fontWeight: '600',
  },
  summaryValueBold: {
    fontSize: 15,
    color: C.white,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
  },
  tipSection: {
    marginBottom: 20,
    gap: 14,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: C.white,
  },
  tipRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  tipChip: {
    flex: 1,
    minWidth: 52,
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: C.navyCard,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  tipChipActive: {
    backgroundColor: C.white,
    borderColor: C.white,
  },
  tipChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.white,
  },
  tipChipTextActive: {
    color: C.navy,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.navyCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.28)',
    gap: 4,
  },
  customDollar: {
    fontSize: 18,
    color: C.whiteDim,
    fontWeight: '500',
  },
  customInput: {
    flex: 1,
    fontSize: 20,
    color: C.white,
    fontWeight: '600',
    paddingVertical: 14,
  },
  tipAmountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  tipAmountLabel: {
    fontSize: 14,
    color: C.whiteDim,
  },
  tipAmountValue: {
    fontSize: 14,
    color: C.white,
    fontWeight: '600',
  },
  finalCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 20,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: 8,
  },
  finalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.whiteDim,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  finalAmount: {
    fontSize: 44,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -1.5,
  },
  payRow: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
  },
  payBtn: {
    backgroundColor: C.white,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  payBtnText: {
    color: C.navy,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});
