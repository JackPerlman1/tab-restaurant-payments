import { router } from 'expo-router';
import { useState } from 'react';
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
import Animated, { FadeIn, FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CardBrandBadge, LockIcon } from '@/components/card-brand';
import { detectCardType, usePayment } from '@/context/payment';
import type { CardType } from '@/context/payment';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  navyDeep: '#0D1830',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  whiteMid: 'rgba(255,255,255,0.70)',
  border: 'rgba(255,255,255,0.09)',
  borderFocus: 'rgba(255,255,255,0.30)',
  green: '#30D158',
};

function formatCardNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(raw: string): string {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
}

type FieldKey = 'cardNumber' | 'name' | 'expiry' | 'cvv';

export default function AddPaymentScreen() {
  const [cardNumber, setCardNumber] = useState('');
  const [name, setName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [focused, setFocused] = useState<FieldKey | null>(null);
  const { addCard } = usePayment();

  const cardType: CardType = detectCardType(cardNumber.replace(/\s/g, ''));
  const cvvLength = cardType === 'amex' ? 4 : 3;

  const handleCardNumberChange = (text: string) => {
    setCardNumber(formatCardNumber(text));
  };

  const handleExpiryChange = (text: string) => {
    setExpiry(formatExpiry(text));
  };

  const handleSave = () => {
    const digits = cardNumber.replace(/\s/g, '');
    const last4 = digits.slice(-4);
    addCard({
      last4,
      type: cardType === 'unknown' ? 'visa' : cardType,
      cardholderName: name.trim(),
      expiry,
    });
    router.back();
  };

  const canSave =
    cardNumber.replace(/\s/g, '').length >= 15 &&
    name.trim().length > 1 &&
    expiry.length === 5 &&
    cvv.length >= cvvLength;

  const inputStyle = (key: FieldKey) => [
    styles.input,
    focused === key && styles.inputFocused,
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          {/* Header with lock */}
          <Animated.View entering={FadeInDown.delay(80).duration(600).springify()} style={styles.header}>
            <Text style={styles.title}>Add Card</Text>
            <View style={styles.secureBadge}>
              <LockIcon color={C.green} />
              <Text style={styles.secureText}>Secure</Text>
            </View>
          </Animated.View>

          {/* Card number field */}
          <Animated.View entering={FadeInDown.delay(180).duration(600).springify()} style={styles.fieldGroup}>
            <Text style={styles.label}>Card Number</Text>
            <View style={styles.cardNumberWrapper}>
              <TextInput
                style={[inputStyle('cardNumber'), styles.cardNumberInput]}
                value={cardNumber}
                onChangeText={handleCardNumberChange}
                onFocus={() => setFocused('cardNumber')}
                onBlur={() => setFocused(null)}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor={C.whiteDim}
                keyboardType="number-pad"
                maxLength={19}
                returnKeyType="next"
              />
              {cardType !== 'unknown' && (
                <Animated.View entering={ZoomIn.duration(200)} style={styles.cardBrandInset}>
                  <CardBrandBadge type={cardType} size="small" />
                </Animated.View>
              )}
            </View>
          </Animated.View>

          {/* Cardholder name */}
          <Animated.View entering={FadeInDown.delay(240).duration(600).springify()} style={styles.fieldGroup}>
            <Text style={styles.label}>Cardholder Name</Text>
            <TextInput
              style={inputStyle('name')}
              value={name}
              onChangeText={setName}
              onFocus={() => setFocused('name')}
              onBlur={() => setFocused(null)}
              placeholder="Name as it appears on card"
              placeholderTextColor={C.whiteDim}
              autoComplete="name"
              autoCapitalize="words"
              returnKeyType="next"
            />
          </Animated.View>

          {/* Expiry + CVV row */}
          <Animated.View entering={FadeInDown.delay(300).duration(600).springify()} style={styles.row}>
            <View style={[styles.fieldGroup, styles.rowField]}>
              <Text style={styles.label}>Expiry</Text>
              <TextInput
                style={inputStyle('expiry')}
                value={expiry}
                onChangeText={handleExpiryChange}
                onFocus={() => setFocused('expiry')}
                onBlur={() => setFocused(null)}
                placeholder="MM/YY"
                placeholderTextColor={C.whiteDim}
                keyboardType="number-pad"
                maxLength={5}
                returnKeyType="next"
              />
            </View>
            <View style={[styles.fieldGroup, styles.rowField]}>
              <Text style={styles.label}>CVV</Text>
              <TextInput
                style={inputStyle('cvv')}
                value={cvv}
                onChangeText={(t) => setCvv(t.replace(/\D/g, '').slice(0, cvvLength))}
                onFocus={() => setFocused('cvv')}
                onBlur={() => setFocused(null)}
                placeholder={'•'.repeat(cvvLength)}
                placeholderTextColor={C.whiteDim}
                keyboardType="number-pad"
                maxLength={cvvLength}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={canSave ? handleSave : undefined}
              />
            </View>
          </Animated.View>

          {/* Trust line */}
          <Animated.View entering={FadeIn.delay(450).duration(600)} style={styles.trustRow}>
            <LockIcon />
            <Text style={styles.trustText}>
              Your card info is encrypted and never stored on our servers
            </Text>
          </Animated.View>

          {/* Save button */}
          <Animated.View entering={FadeInDown.delay(380).duration(600).springify()}>
            <TouchableOpacity
              style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}
              activeOpacity={canSave ? 0.85 : 1}
              onPress={canSave ? handleSave : undefined}>
              <Text style={[styles.saveBtnText, !canSave && styles.saveBtnTextDisabled]}>
                Add Card
              </Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 32,
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  secureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(48,209,88,0.10)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(48,209,88,0.18)',
  },
  secureText: {
    color: C.green,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  fieldGroup: {
    gap: 8,
    marginBottom: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: C.whiteMid,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: C.navyCard,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  inputFocused: {
    borderColor: C.borderFocus,
  },
  cardNumberWrapper: {
    position: 'relative',
  },
  cardNumberInput: {
    paddingRight: 56,
    letterSpacing: 1.5,
    fontSize: 17,
    fontWeight: '500',
  },
  cardBrandInset: {
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 0,
  },
  rowField: {
    flex: 1,
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginBottom: 28,
    marginTop: 4,
    paddingHorizontal: 4,
  },
  trustText: {
    flex: 1,
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 17,
    fontWeight: '400',
  },
  saveBtn: {
    backgroundColor: C.white,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  saveBtnText: {
    color: C.navy,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  saveBtnTextDisabled: {
    color: 'rgba(255,255,255,0.30)',
  },
});
