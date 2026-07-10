import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { fmt, useTab } from '@/context/tab';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  border: 'rgba(255,255,255,0.07)',
  green: '#30D158',
};

export default function ActiveTabScreen() {
  const { openTab } = useTab();

  if (!openTab) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No Active Tab</Text>
          <Text style={styles.emptySub}>When you open a tab at a restaurant, it will appear here.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const { restaurantName, tableNumber, items, openedAt, subtotal, tax, total } = openTab;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <Animated.View entering={FadeInDown.delay(60).duration(600).springify()} style={styles.header}>
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveLabel}>LIVE TAB</Text>
            </View>
            <Text style={styles.restaurant}>{restaurantName}</Text>
            <Text style={styles.meta}>Table {tableNumber} · Opened at {openedAt}</Text>
          </Animated.View>

          {/* Items */}
          <Animated.View entering={FadeInDown.delay(160).duration(600).springify()} style={styles.card}>
            <Text style={styles.cardSectionLabel}>ITEMS</Text>
            {items.map((item, i) => (
              <View key={item.id}>
                <View style={styles.itemRow}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    {item.quantity > 1 && (
                      <Text style={styles.itemQty}>×{item.quantity}</Text>
                    )}
                  </View>
                  <Text style={styles.itemPrice}>${fmt(item.price * item.quantity)}</Text>
                </View>
                {i < items.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Animated.View>

          {/* Totals */}
          <Animated.View entering={FadeInDown.delay(260).duration(600).springify()} style={styles.card}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Subtotal</Text>
              <Text style={styles.totalValue}>${fmt(subtotal)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Tax</Text>
              <Text style={styles.totalValue}>${fmt(tax)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.grandLabel}>Total</Text>
              <Text style={styles.grandValue}>${fmt(total)}</Text>
            </View>
            <Text style={styles.tipNote}>Tip not included</Text>
          </Animated.View>
        </ScrollView>

        {/* Sticky action buttons */}
        <Animated.View entering={FadeInDown.delay(340).duration(600).springify()} style={styles.actions}>
          <TouchableOpacity
            style={styles.btnPrimary}
            activeOpacity={0.85}
            onPress={() => router.push('/customer/tip-payment')}>
            <Text style={styles.btnPrimaryText}>Pay &amp; Leave</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnGhost}
            activeOpacity={0.75}
            onPress={() => router.push('/customer/split')}>
            <Text style={styles.btnGhostText}>Split with Friends</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: C.white,
  },
  emptySub: {
    fontSize: 15,
    color: C.whiteDim,
    textAlign: 'center',
    lineHeight: 22,
  },
  header: {
    paddingTop: 8,
    marginBottom: 20,
    gap: 4,
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginBottom: 6,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.green,
  },
  liveLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: C.green,
    letterSpacing: 1.4,
  },
  restaurant: {
    fontSize: 28,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  meta: {
    fontSize: 14,
    color: C.whiteDim,
  },
  card: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardSectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  itemName: {
    flex: 1,
    fontSize: 15,
    color: C.white,
    fontWeight: '400',
  },
  itemQty: {
    fontSize: 13,
    color: C.whiteDim,
    fontWeight: '500',
  },
  itemPrice: {
    fontSize: 15,
    color: C.white,
    fontWeight: '600',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    color: C.whiteDim,
    fontWeight: '400',
  },
  totalValue: {
    fontSize: 15,
    color: C.white,
    fontWeight: '500',
  },
  grandLabel: {
    fontSize: 17,
    color: C.white,
    fontWeight: '700',
  },
  grandValue: {
    fontSize: 22,
    color: C.white,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  tipNote: {
    fontSize: 11,
    color: C.whiteDim,
    textAlign: 'right',
    marginTop: 4,
  },
  actions: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 12,
    gap: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
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
    borderColor: 'rgba(255,255,255,0.14)',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  btnGhostText: {
    color: C.white,
    fontSize: 15,
    fontWeight: '500',
  },
});
