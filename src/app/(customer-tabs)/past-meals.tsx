import { router } from 'expo-router';
import { Platform, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useState } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { useTab } from '@/context/tab';
import type { PastMeal } from '@/context/tab';
import { PressableScale } from '@/components/pressable-scale';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  border: 'rgba(255,255,255,0.07)',
  gold: '#C9A84C',
};

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIcon}>
        {Platform.OS === 'ios' ? (
          <SymbolView name="fork.knife.circle" tintColor="rgba(255,255,255,0.22)" style={{ width: 56, height: 56 }} />
        ) : (
          <Text style={styles.emptyEmoji}>🍽</Text>
        )}
      </View>
      <Text style={styles.emptyTitle}>No meals yet</Text>
      <Text style={styles.emptySubtitle}>
        Your dining history will appear here after your first tab
      </Text>
    </View>
  );
}

function MealRow({ meal, delay }: { meal: PastMeal; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500).springify()}>
      <PressableScale onPress={() => router.push(`/customer/meal/${meal.id}`)}>
        <View style={styles.mealCard}>
          <View style={styles.mealTop}>
            <Text style={styles.mealRestaurant} numberOfLines={1}>{meal.restaurantName}</Text>
            <Text style={styles.mealTotal}>${meal.total.toFixed(2)}</Text>
          </View>

          <View style={styles.mealMeta}>
            <Text style={styles.mealDate}>{meal.date}</Text>
            <View style={styles.metaTags}>
              <View style={styles.tipBadge}>
                <Text style={styles.tipBadgeText}>{meal.tipPercentage}% tip</Text>
              </View>
              {meal.splitWith && meal.splitWith.length > 0 && (
                <View style={styles.splitBadge}>
                  <Text style={styles.splitBadgeText}>Split</Text>
                </View>
              )}
            </View>
          </View>

          {meal.splitWith && meal.splitWith.length > 0 && (
            <Text style={styles.splitWith} numberOfLines={1}>
              with {meal.splitWith.join(', ')}
            </Text>
          )}
        </View>
      </PressableScale>
    </Animated.View>
  );
}

export default function PastMealsScreen() {
  const { pastMeals } = useTab();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={[styles.scroll, pastMeals.length === 0 && styles.scrollEmpty]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="rgba(255,255,255,0.50)"
            colors={['rgba(255,255,255,0.50)']}
          />
        }>
        <Animated.View entering={FadeInDown.delay(60).duration(600).springify()} style={styles.header}>
          <Text style={styles.title}>Past Meals</Text>
          <Text style={styles.subtitle}>{pastMeals.length} visit{pastMeals.length !== 1 ? 's' : ''}</Text>
        </Animated.View>

        {pastMeals.length === 0 ? (
          <EmptyState />
        ) : (
          pastMeals.map((meal, i) => (
            <MealRow key={meal.id} meal={meal} delay={120 + i * 60} />
          ))
        )}
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
  scrollEmpty: {
    flex: 1,
  },
  header: {
    paddingTop: 8,
    marginBottom: 24,
    gap: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: C.whiteDim,
  },
  // Empty state
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 60,
    gap: 14,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    color: C.whiteDim,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Meal card
  mealCard: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    gap: 6,
  },
  mealTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mealRestaurant: {
    fontSize: 17,
    fontWeight: '700',
    color: C.white,
    flex: 1,
    marginRight: 12,
    letterSpacing: -0.2,
  },
  mealTotal: {
    fontSize: 17,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.2,
  },
  mealMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mealDate: {
    fontSize: 13,
    color: C.whiteDim,
  },
  metaTags: {
    flexDirection: 'row',
    gap: 6,
  },
  tipBadge: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tipBadgeText: {
    fontSize: 11,
    color: C.whiteDim,
    fontWeight: '600',
  },
  splitBadge: {
    backgroundColor: 'rgba(201,168,76,0.18)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  splitBadgeText: {
    fontSize: 11,
    color: C.gold,
    fontWeight: '600',
  },
  splitWith: {
    fontSize: 12,
    color: C.whiteDim,
    marginTop: 2,
  },
});
