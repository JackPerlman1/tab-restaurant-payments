import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useTab } from '@/context/tab';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  border: 'rgba(255,255,255,0.07)',
  gold: '#C9A84C',
};

export default function MealDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { pastMeals } = useTab();
  const meal = pastMeals.find((m) => m.id === id);

  if (!meal) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Meal not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const yourShare =
    meal.splitWith && meal.splitWith.length > 0
      ? meal.total / (meal.splitWith.length + 1)
      : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Animated.View entering={FadeInDown.delay(60).duration(600).springify()} style={styles.header}>
          <Text style={styles.restaurant}>{meal.restaurantName}</Text>
          <Text style={styles.meta}>{meal.date} · {meal.time}</Text>
        </Animated.View>

        {/* Items */}
        <Animated.View entering={FadeInDown.delay(140).duration(600).springify()} style={styles.card}>
          <Text style={styles.cardLabel}>ITEMS</Text>
          {meal.items.map((item, i) => (
            <View key={item.id}>
              <View style={styles.itemRow}>
                <View style={styles.itemLeft}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.quantity > 1 && (
                    <Text style={styles.itemQty}>×{item.quantity}</Text>
                  )}
                </View>
                <Text style={styles.itemPrice}>
                  ${(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
              {i < meal.items.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </Animated.View>

        {/* Totals */}
        <Animated.View entering={FadeInDown.delay(220).duration(600).springify()} style={styles.card}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${meal.subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax</Text>
            <Text style={styles.totalValue}>${meal.tax.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tip ({meal.tipPercentage}%)</Text>
            <Text style={styles.totalValue}>${meal.tipAmount.toFixed(2)}</Text>
          </View>
          <View style={styles.dividerThick} />
          <View style={styles.totalRow}>
            <Text style={styles.grandLabel}>Total</Text>
            <Text style={styles.grandValue}>${meal.total.toFixed(2)}</Text>
          </View>
        </Animated.View>

        {/* Split info */}
        {meal.splitWith && meal.splitWith.length > 0 && (
          <Animated.View entering={FadeInDown.delay(300).duration(600).springify()} style={styles.card}>
            <Text style={styles.cardLabel}>SPLIT WITH</Text>
            {meal.splitWith.map((name) => (
              <View key={name} style={styles.splitPersonRow}>
                <View style={styles.splitAvatar}>
                  <Text style={styles.splitAvatarText}>{name.charAt(0)}</Text>
                </View>
                <Text style={styles.splitPersonName}>{name}</Text>
              </View>
            ))}
            {yourShare !== null && (
              <>
                <View style={styles.divider} />
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Your share</Text>
                  <Text style={[styles.grandValue, { color: C.gold }]}>
                    ${yourShare.toFixed(2)}
                  </Text>
                </View>
              </>
            )}
          </Animated.View>
        )}

        {/* Share receipt button (cosmetic) */}
        <Animated.View entering={FadeInDown.delay(360).duration(500)}>
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7}>
            <Text style={styles.shareBtnText}>Share Receipt</Text>
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
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: C.whiteDim,
    fontSize: 15,
  },
  header: {
    marginBottom: 22,
    gap: 4,
  },
  restaurant: {
    fontSize: 30,
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
  cardLabel: {
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
  itemLeft: {
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
    fontWeight: '500',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
  },
  dividerThick: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
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
  splitPersonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  splitAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(201,168,76,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  splitAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: C.gold,
  },
  splitPersonName: {
    fontSize: 15,
    color: C.white,
    fontWeight: '500',
  },
  shareBtn: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  shareBtnText: {
    color: C.whiteDim,
    fontSize: 15,
    fontWeight: '500',
  },
});
