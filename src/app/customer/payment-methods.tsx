import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { CardBrandBadge, ChevronRight, TypeLabel } from '@/components/card-brand';
import { usePayment } from '@/context/payment';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  navyRow: '#162240',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  whiteFaint: 'rgba(255,255,255,0.09)',
  border: 'rgba(255,255,255,0.07)',
};

function ApplePayCard() {
  function AppleLogo() {
    if (Platform.OS === 'ios') {
      return (
        <SymbolView
          name="apple.logo"
          tintColor="#FFFFFF"
          style={{ width: 19, height: 23 }}
        />
      );
    }
    return <Text style={{ color: '#FFFFFF', fontSize: 19, lineHeight: 23 }}>🍎</Text>;
  }

  return (
    <TouchableOpacity style={styles.applePayCard} activeOpacity={0.8}>
      <View style={styles.applePayRow}>
        <AppleLogo />
        <Text style={styles.applePayText}>Pay</Text>
      </View>
      <Text style={styles.applePaySub}>Set up with Face ID or Touch ID</Text>
    </TouchableOpacity>
  );
}

export default function PaymentMethodsScreen() {
  const { cards } = usePayment();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(80).duration(600).springify()}>
          <Text style={styles.title}>Payment Methods</Text>
        </Animated.View>

        {/* Apple Pay */}
        <Animated.View entering={FadeInDown.delay(180).duration(600).springify()} style={styles.section}>
          <Text style={styles.sectionHeader}>Apple Pay</Text>
          <ApplePayCard />
        </Animated.View>

        {/* Saved cards */}
        <Animated.View entering={FadeInDown.delay(280).duration(600).springify()} style={styles.section}>
          <Text style={styles.sectionHeader}>Saved Cards</Text>
          <View style={styles.cardList}>
            {cards.map((card, i) => (
              <TouchableOpacity
                key={card.id}
                style={[styles.cardRow, i < cards.length - 1 && styles.cardRowBorder]}
                activeOpacity={0.7}>
                <CardBrandBadge type={card.type} size="medium" />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardNumber}>•••• {card.last4}</Text>
                  <Text style={styles.cardExpiry}>Expires {card.expiry}</Text>
                </View>
                <TypeLabel type={card.type} />
                <ChevronRight />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Add button */}
        <Animated.View entering={FadeInDown.delay(360).duration(600).springify()}>
          <TouchableOpacity
            style={styles.addBtn}
            activeOpacity={0.75}
            onPress={() => router.push('/customer/add-payment')}>
            <View style={styles.addBtnPlus}>
              <Text style={styles.addBtnPlusText}>+</Text>
            </View>
            <Text style={styles.addBtnText}>Add Payment Method</Text>
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
    fontSize: 30,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
    marginBottom: 28,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  // Apple Pay card
  applePayCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  applePayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  applePayText: {
    fontSize: 22,
    fontWeight: '600',
    color: C.white,
    letterSpacing: -0.3,
  },
  applePaySub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.40)',
    fontWeight: '400',
  },
  // Card list
  cardList: {
    backgroundColor: C.navyCard,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: C.border,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
  },
  cardRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: C.border,
  },
  cardInfo: {
    flex: 1,
    gap: 2,
  },
  cardNumber: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
    letterSpacing: 0.5,
  },
  cardExpiry: {
    fontSize: 12,
    color: C.whiteDim,
    fontWeight: '400',
  },
  // Add button
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: C.navyCard,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 15,
    borderWidth: 1,
    borderColor: C.border,
    borderStyle: 'dashed',
  },
  addBtnPlus: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnPlusText: {
    color: C.white,
    fontSize: 18,
    lineHeight: 20,
    fontWeight: '300',
  },
  addBtnText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '500',
  },
});
