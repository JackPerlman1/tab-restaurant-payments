import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import * as Haptics from 'expo-haptics';
import { Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  cancelAnimation,
  FadeInDown,
  FadeInUp,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import {
  fmt,
  tableTax,
  tableSubtotal,
  tableTotal,
  useRestaurant,
} from '@/context/restaurant';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  border: 'rgba(255,255,255,0.07)',
  green: '#30D158',
  amber: '#FF9F0A',
  red: '#FF453A',
};

function minutesSince(ts: number): number {
  return Math.floor((Date.now() - ts) / 60000);
}

function CheckCircle() {
  const scale = useSharedValue(0);
  useEffect(() => {
    scale.value = withSpring(1, { damping: 12, stiffness: 100 });
  }, []);
  const anim = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  if (Platform.OS === 'ios') {
    return (
      <Animated.View style={anim}>
        <SymbolView name="checkmark.circle.fill" tintColor={C.green} style={{ width: 56, height: 56 }} />
      </Animated.View>
    );
  }
  return (
    <Animated.View style={[styles.checkCircle, anim]}>
      <Text style={styles.checkMark}>✓</Text>
    </Animated.View>
  );
}

function PulsingDot() {
  const opacity = useSharedValue(1);
  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.2, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      false,
    );
    return () => cancelAnimation(opacity);
  }, []);
  const anim = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return <Animated.View style={[styles.pulsingDot, anim]} />;
}

function NotificationBanner() {
  const { notification, setNotification } = useRestaurant();

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4500);
    return () => clearTimeout(t);
  }, [notification]);

  if (!notification) return null;

  return (
    <Animated.View
      entering={FadeInUp.duration(380).springify()}
      exiting={FadeOut.duration(220)}
      pointerEvents="none"
      style={styles.notifBanner}>
      <View style={styles.notifDot} />
      <Text style={styles.notifText}>{notification}</Text>
    </Animated.View>
  );
}

export default function TableDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tables, sendBill, simulatePayment, clearTable } = useRestaurant();
  const table = tables.find((t) => t.id === id);

  if (!table) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Table not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sub = tableSubtotal(table.orders);
  const tax = tableTax(table.orders);
  const total = tableTotal(table.orders);
  const tip = table.tipAmount ?? 0;
  const grandTotal = total + tip;

  const mins = minutesSince(table.seatedAt);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <NotificationBanner />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(60).duration(600).springify()} style={styles.tableHeader}>
          <View style={styles.tableHeaderLeft}>
            <Text style={styles.tableLabel}>TABLE {table.number}</Text>
            <Text style={styles.customerName}>{table.customerName}</Text>
            <Text style={styles.seatedTime}>Seated {mins} min ago</Text>
          </View>
          <StatusBadge status={table.status} />
        </Animated.View>

        {/* Orders */}
        {table.orders.length > 0 ? (
          <Animated.View entering={FadeInDown.delay(130).duration(600).springify()} style={styles.card}>
            <Text style={styles.cardLabel}>ITEMS</Text>
            {table.orders.map((order, i) => (
              <View key={`${order.menuItemId}-${i}`}>
                <View style={styles.orderRow}>
                  <View style={styles.orderLeft}>
                    <Text style={styles.orderName}>{order.name}</Text>
                    {order.quantity > 1 && (
                      <Text style={styles.orderQty}>×{order.quantity}</Text>
                    )}
                  </View>
                  <Text style={styles.orderPrice}>${fmt(order.price * order.quantity)}</Text>
                </View>
                {i < table.orders.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown.delay(130).duration(500)} style={styles.emptyOrders}>
            <Text style={styles.emptyOrdersText}>No items yet</Text>
          </Animated.View>
        )}

        {/* Totals */}
        <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${fmt(sub)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax (8%)</Text>
            <Text style={styles.totalValue}>${fmt(tax)}</Text>
          </View>
          <View style={styles.dividerThick} />
          <View style={styles.totalRow}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>${fmt(total)}</Text>
          </View>
        </Animated.View>

        {/* Status-specific actions */}
        <Animated.View entering={FadeInDown.delay(270).duration(600).springify()}>
          {table.status === 'open' && (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.addItemsBtn}
                activeOpacity={0.82}
                onPress={() => router.push(`/restaurant/add-to-table/${table.id}`)}>
                <Text style={styles.addItemsBtnText}>+ Add Items</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.sendBillBtn}
                activeOpacity={0.82}
                onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); sendBill(table.id); }}>
                <Text style={styles.sendBillBtnText}>Send Bill to Phone</Text>
              </TouchableOpacity>
            </View>
          )}

          {table.status === 'bill_sent' && (
            <View style={styles.awaitingCard}>
              <View style={styles.awaitingHeader}>
                <PulsingDot />
                <Text style={styles.awaitingTitle}>Awaiting Payment</Text>
              </View>
              <Text style={styles.awaitingAmount}>${fmt(total)}</Text>
              <Text style={styles.awaitingNote}>Bill sent to {table.customerName}'s phone</Text>

              <TouchableOpacity
                style={styles.simulateBtn}
                activeOpacity={0.75}
                onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); simulatePayment(table.id); }}>
                <Text style={styles.simulateBtnText}>Simulate Customer Payment</Text>
              </TouchableOpacity>
            </View>
          )}

          {table.status === 'paid' && (
            <View style={styles.paidCard}>
              <CheckCircle />
              <Text style={styles.paidTitle}>Paid</Text>
              <Text style={styles.paidAmount}>${fmt(grandTotal)}</Text>
              <Text style={styles.paidNote}>
                incl. {table.tipPercentage}% tip (${fmt(tip)})
              </Text>

              <TouchableOpacity
                style={styles.clearBtn}
                activeOpacity={0.82}
                onPress={() => {
                  clearTable(table.id);
                  router.back();
                }}>
                <Text style={styles.clearBtnText}>Close Table</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color = status === 'paid' ? C.green : status === 'bill_sent' ? C.amber : 'rgba(255,255,255,0.30)';
  const label = status === 'paid' ? 'Paid' : status === 'bill_sent' ? 'Awaiting' : 'Open';

  return (
    <View style={[styles.statusBadge, { borderColor: color + '40' }]}>
      <View style={[styles.statusBadgeDot, { backgroundColor: color }]} />
      <Text style={[styles.statusBadgeText, { color }]}>{label}</Text>
    </View>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: C.whiteDim,
    fontSize: 15,
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  tableHeaderLeft: {
    gap: 3,
    flex: 1,
  },
  tableLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  customerName: {
    fontSize: 30,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  seatedTime: {
    fontSize: 13,
    color: C.whiteDim,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexShrink: 0,
  },
  statusBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  card: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  emptyOrders: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 24,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  emptyOrdersText: {
    fontSize: 14,
    color: C.whiteDim,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  orderLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginRight: 12,
  },
  orderName: {
    flex: 1,
    fontSize: 15,
    color: C.white,
    fontWeight: '400',
  },
  orderQty: {
    fontSize: 13,
    color: C.whiteDim,
    fontWeight: '500',
  },
  orderPrice: {
    fontSize: 15,
    color: C.white,
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
  },
  dividerThick: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.10)',
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  totalLabel: {
    fontSize: 15,
    color: C.whiteDim,
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
    fontSize: 20,
    color: C.white,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  // Open state actions
  actionsRow: {
    gap: 10,
  },
  addItemsBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addItemsBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
  sendBillBtn: {
    backgroundColor: C.white,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  sendBillBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.navy,
    letterSpacing: 0.1,
  },
  // Bill sent state
  awaitingCard: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,159,10,0.15)',
  },
  awaitingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  pulsingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: C.amber,
  },
  awaitingTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.amber,
    letterSpacing: 0.2,
  },
  awaitingAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -1,
  },
  awaitingNote: {
    fontSize: 13,
    color: C.whiteDim,
    marginBottom: 16,
  },
  simulateBtn: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  simulateBtnText: {
    fontSize: 13,
    fontWeight: '500',
    color: C.whiteDim,
  },
  // Paid state
  paidCard: {
    backgroundColor: 'rgba(18,50,26,0.60)',
    borderRadius: 18,
    padding: 28,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(48,209,88,0.18)',
  },
  checkCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.green,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  checkMark: {
    fontSize: 28,
    color: C.white,
    fontWeight: '700',
  },
  paidTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: C.green,
    letterSpacing: -0.2,
  },
  paidAmount: {
    fontSize: 40,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -1,
    marginTop: 4,
  },
  paidNote: {
    fontSize: 13,
    color: C.whiteDim,
    marginBottom: 20,
  },
  clearBtn: {
    backgroundColor: C.white,
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 40,
    alignItems: 'center',
  },
  clearBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.navy,
  },
  // Notification banner
  notifBanner: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 100,
    zIndex: 999,
    backgroundColor: 'rgba(18,50,26,0.95)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(48,209,88,0.25)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: C.green,
    flexShrink: 0,
  },
  notifText: {
    color: C.white,
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
