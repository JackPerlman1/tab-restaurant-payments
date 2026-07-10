import { Platform, StyleSheet, Text, View } from 'react-native';
import { SymbolView } from 'expo-symbols';

import type { CardType } from '@/context/payment';

type Size = 'small' | 'medium';

function LockIcon({ color = 'rgba(255,255,255,0.45)' }: { color?: string }) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name="lock.fill"
        tintColor={color as string}
        style={{ width: 13, height: 13 }}
      />
    );
  }
  return <Text style={{ color, fontSize: 13 }}>🔒</Text>;
}

function ChevronRight({ color = 'rgba(255,255,255,0.25)' }: { color?: string }) {
  if (Platform.OS === 'ios') {
    return (
      <SymbolView
        name="chevron.right"
        tintColor={color as string}
        style={{ width: 12, height: 14 }}
      />
    );
  }
  return <Text style={{ color, fontSize: 14, lineHeight: 16 }}>›</Text>;
}

function CardBrandBadge({ type, size = 'medium' }: { type: CardType; size?: Size }) {
  const w = size === 'small' ? 38 : 46;
  const h = size === 'small' ? 24 : 30;
  const fontSize = size === 'small' ? 8 : 10;

  if (type === 'visa') {
    return (
      <View style={[badge.base, { width: w, height: h, backgroundColor: '#1A1F71' }]}>
        <Text style={[badge.text, { fontSize, fontStyle: 'italic', color: '#FFFFFF', fontWeight: '900', letterSpacing: 0 }]}>
          VISA
        </Text>
      </View>
    );
  }

  if (type === 'mastercard') {
    const r = h * 0.38;
    return (
      <View style={[badge.base, { width: w, height: h, backgroundColor: 'transparent' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: r * 2, height: r * 2, borderRadius: r, backgroundColor: '#EB001B' }} />
          <View style={{ width: r * 2, height: r * 2, borderRadius: r, backgroundColor: '#F79E1B', marginLeft: -r * 0.7 }} />
        </View>
      </View>
    );
  }

  if (type === 'amex') {
    return (
      <View style={[badge.base, { width: w, height: h, backgroundColor: '#007BC1' }]}>
        <Text style={[badge.text, { fontSize, color: '#FFFFFF', fontWeight: '800', letterSpacing: 0.5 }]}>
          AMEX
        </Text>
      </View>
    );
  }

  return (
    <View style={[badge.base, { width: w, height: h, backgroundColor: 'rgba(255,255,255,0.08)' }]}>
      <Text style={{ fontSize: h * 0.5, lineHeight: h }}>💳</Text>
    </View>
  );
}

function TypeLabel({ type }: { type: CardType }) {
  const labels: Record<CardType, string> = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'Amex',
    unknown: 'Card',
  };
  return (
    <View style={typePill.wrap}>
      <Text style={typePill.text}>{labels[type]}</Text>
    </View>
  );
}

const badge = StyleSheet.create({
  base: {
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  text: {
    textAlign: 'center',
  },
});

const typePill = StyleSheet.create({
  wrap: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 5,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  text: {
    color: 'rgba(255,255,255,0.55)',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export { CardBrandBadge, ChevronRight, LockIcon, TypeLabel };
