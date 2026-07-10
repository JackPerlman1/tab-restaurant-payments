import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  fmt,
  fmtTime,
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
};

export default function ClosedTableReceiptScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { closedTables } = useRestaurant();
  const table = closedTables.find((t) => t.id === id);

  if (!table) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Receipt not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const sub = tableSubtotal(table.orders);
  const tax = tableTax(table.orders);
  const total = tableTotal(table.orders);
  const grandTotal = total + table.tipAmount;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* Header */}
        <Animated.View entering={FadeInDown.delay(60).duration(600).springify()} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.tableLabel}>TABLE {table.number}</Text>
            <Text style={styles.customerName}>{table.customerName}</Text>
            <Text style={styles.closedTime}>Closed at {fmtTime(table.closedAt)}</Text>
          </View>
          <View style={styles.closedBadge}>
            <View style={styles.closedDot} />
            <Text style={styles.closedBadgeText}>Closed</Text>
          </View>
        </Animated.View>

        {/* Items */}
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
            <Text style={styles.totalLabel}>Total before tip</Text>
            <Text style={styles.totalValue}>${fmt(total)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>
              Tip{' '}
              <Text style={styles.tipPercent}>({table.tipPercentage}%)</Text>
            </Text>
            <Text style={styles.tipValue}>+${fmt(table.tipAmount)}</Text>
          </View>
          <View style={styles.dividerThick} />
          <View style={styles.totalRow}>
            <Text style={styles.grandLabel}>Grand Total</Text>
            <Text style={styles.grandValue}>${fmt(grandTotal)}</Text>
          </View>
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: C.whiteDim,
    fontSize: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 22,
  },
  headerLeft: {
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
  closedTime: {
    fontSize: 13,
    color: C.whiteDim,
    marginTop: 2,
  },
  closedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: C.green + '40',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexShrink: 0,
  },
  closedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.green,
  },
  closedBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.green,
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
    alignItems: 'center',
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
  tipPercent: {
    fontSize: 13,
    color: C.whiteDim,
    fontWeight: '400',
  },
  tipValue: {
    fontSize: 15,
    color: C.green,
    fontWeight: '600',
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
});
