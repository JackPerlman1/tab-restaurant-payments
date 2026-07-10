import { router } from 'expo-router';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { useAuth } from '@/context/auth';
import { fmt, tableTotal, useRestaurant } from '@/context/restaurant';
import { PressableScale } from '@/components/pressable-scale';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  whiteMid: 'rgba(255,255,255,0.70)',
  border: 'rgba(255,255,255,0.07)',
  green: '#30D158',
  amber: '#FF9F0A',
  gold: '#C9A84C',
};

const MOCK_STATS = {
  revenue: 1847,
  tablesServed: 14,
  avgTip: 21.3,
  avgCheck: 131.93,
};

const TIP_BY_DAY = [
  { label: 'M', value: 18.5, height: 44 },
  { label: 'T', value: 19.2, height: 46 },
  { label: 'W', value: 20.1, height: 48 },
  { label: 'T', value: 22.4, height: 53 },
  { label: 'F', value: 24.8, height: 59 },
  { label: 'S', value: 25.2, height: 60 },
  { label: 'S', value: 21.0, height: 50 },
];

// Mon=0 … Sun=6
const TODAY_IDX = (new Date().getDay() + 6) % 7;

function StatCard({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <Animated.View entering={FadeInDown.delay(delay).duration(500).springify()} style={styles.statCard}>
      <Text style={styles.statValue} adjustsFontSizeToFit numberOfLines={1}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

function minutesSince(ts: number): number {
  return Math.floor((Date.now() - ts) / 60000);
}

function statusDotColor(status: string): string {
  if (status === 'paid') return C.green;
  if (status === 'bill_sent') return C.amber;
  return 'rgba(255,255,255,0.25)';
}

function statusLabel(status: string): string {
  if (status === 'paid') return 'Paid';
  if (status === 'bill_sent') return 'Awaiting';
  return 'Open';
}

function InsightsSection() {
  return (
    <Animated.View entering={FadeInDown.delay(480).duration(600).springify()}>
      <Text style={styles.sectionTitle}>Insights</Text>

      {/* Bar chart card */}
      <View style={styles.insightCard}>
        <Text style={styles.insightCardLabel}>AVG TIP BY DAY</Text>
        <View style={styles.barChart}>
          {TIP_BY_DAY.map((d, i) => {
            const isToday = i === TODAY_IDX;
            return (
              <Animated.View
                key={i}
                entering={FadeInDown.delay(500 + i * 55).duration(500).springify()}
                style={styles.barCol}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      { height: d.height },
                      isToday && styles.barToday,
                    ]}
                  />
                </View>
                <Text style={[styles.barLabel, isToday && styles.barLabelToday]}>{d.label}</Text>
                <Text style={[styles.barValue, isToday && styles.barValueToday]}>
                  {d.value}%
                </Text>
              </Animated.View>
            );
          })}
        </View>
      </View>

      {/* Highlight card */}
      <Animated.View entering={FadeInDown.delay(600).duration(500).springify()} style={styles.highlightCard}>
        <View style={styles.highlightLeft}>
          {Platform.OS === 'ios' ? (
            <SymbolView name="star.circle.fill" tintColor={C.gold} style={{ width: 36, height: 36 }} />
          ) : (
            <Text style={{ fontSize: 28 }}>⭐</Text>
          )}
        </View>
        <View style={styles.highlightRight}>
          <Text style={styles.highlightTitle}>Your avg tip is 21.3%</Text>
          <Text style={styles.highlightSub}>4% above industry average · Keep it up</Text>
        </View>
      </Animated.View>

      {/* Peak hours */}
      <Animated.View entering={FadeInDown.delay(660).duration(500)} style={styles.insightCard}>
        <Text style={styles.insightCardLabel}>PEAK HOURS</Text>
        <View style={styles.peakRow}>
          <View style={styles.peakItem}>
            <Text style={styles.peakTime}>7 – 9 PM</Text>
            <View style={styles.peakBar}>
              <View style={[styles.peakFill, { flex: 0.9 }]} />
            </View>
            <Text style={styles.peakCovers}>38 covers</Text>
          </View>
          <View style={styles.peakItem}>
            <Text style={styles.peakTime}>5 – 7 PM</Text>
            <View style={styles.peakBar}>
              <View style={[styles.peakFill, { flex: 0.65 }]} />
            </View>
            <Text style={styles.peakCovers}>29 covers</Text>
          </View>
          <View style={styles.peakItem}>
            <Text style={styles.peakTime}>9 – 11 PM</Text>
            <View style={styles.peakBar}>
              <View style={[styles.peakFill, { flex: 0.45 }]} />
            </View>
            <Text style={styles.peakCovers}>21 covers</Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const { tables } = useRestaurant();
  const restaurantName = user?.type === 'restaurant' ? user.restaurantName : 'Your Restaurant';
  const activeTables = tables.filter((t) => t.status !== 'paid');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(60).duration(600).springify()} style={styles.header}>
          <Text style={styles.date}>Today</Text>
          <Text style={styles.restaurantName} numberOfLines={1}>{restaurantName}</Text>
        </Animated.View>

        {/* Stats grid */}
        <View style={styles.statsGrid}>
          <StatCard label="Revenue" value={`$${MOCK_STATS.revenue.toLocaleString()}`} delay={120} />
          <StatCard label="Tables Served" value={String(MOCK_STATS.tablesServed)} delay={170} />
          <StatCard label="Avg Tip" value={`${MOCK_STATS.avgTip}%`} delay={220} />
          <StatCard label="Avg Check" value={`$${fmt(MOCK_STATS.avgCheck)}`} delay={270} />
        </View>

        {/* Active tables */}
        <Animated.View entering={FadeInDown.delay(320).duration(600).springify()}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Active Tables</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>{activeTables.length}</Text>
            </View>
          </View>
        </Animated.View>

        {activeTables.length === 0 ? (
          <Animated.View entering={FadeInDown.delay(380).duration(500)} style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No open tables</Text>
            <Text style={styles.emptySubtitle}>Open a tab to get started</Text>
          </Animated.View>
        ) : (
          activeTables.map((table, i) => (
            <Animated.View
              key={table.id}
              entering={FadeInDown.delay(360 + i * 50).duration(500).springify()}>
              <PressableScale
                onPress={() => router.push(`/restaurant/table/${table.id}`)}
                style={styles.tableCard}>
                <View style={styles.tableLeft}>
                  <View style={styles.tableNumBadge}>
                    <Text style={styles.tableNumText}>{table.number}</Text>
                  </View>
                  <View style={styles.tableInfo}>
                    <Text style={styles.tableName} numberOfLines={1}>{table.customerName}</Text>
                    <Text style={styles.tableMeta}>{minutesSince(table.seatedAt)} min</Text>
                  </View>
                </View>
                <View style={styles.tableRight}>
                  <Text style={styles.tableTotal} numberOfLines={1}>${fmt(tableTotal(table.orders))}</Text>
                  <View style={[styles.statusDot, { backgroundColor: statusDotColor(table.status) }]} />
                  <Text style={[styles.statusText, { color: statusDotColor(table.status) }]}>
                    {statusLabel(table.status)}
                  </Text>
                </View>
              </PressableScale>
            </Animated.View>
          ))
        )}

        {/* Insights */}
        <InsightsSection />
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
  header: {
    paddingTop: 8,
    marginBottom: 24,
    gap: 3,
  },
  date: {
    fontSize: 13,
    fontWeight: '600',
    color: C.whiteDim,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  restaurantName: {
    fontSize: 30,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: C.navyCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: C.border,
    gap: 4,
  },
  statValue: {
    fontSize: 26,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    color: C.whiteDim,
    fontWeight: '500',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.2,
    marginBottom: 12,
    marginTop: 4,
  },
  countBadge: {
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  countBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: C.whiteDim,
  },
  emptyState: {
    paddingVertical: 28,
    paddingHorizontal: 4,
    gap: 4,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
  emptySubtitle: {
    fontSize: 13,
    color: C.whiteDim,
  },
  tableCard: {
    backgroundColor: C.navyCard,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tableLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  tableNumBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  tableNumText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.white,
  },
  tableInfo: {
    gap: 2,
    flex: 1,
  },
  tableName: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
  tableMeta: {
    fontSize: 12,
    color: C.whiteDim,
  },
  tableRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  tableTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.2,
    maxWidth: 80,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  // Insights
  insightCard: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 18,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  insightCardLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  barCol: {
    alignItems: 'center',
    gap: 5,
    flex: 1,
  },
  barTrack: {
    height: 62,
    justifyContent: 'flex-end',
  },
  bar: {
    width: 22,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  barToday: {
    backgroundColor: C.white,
  },
  barLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: C.whiteDim,
  },
  barLabelToday: {
    color: C.white,
  },
  barValue: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: '500',
  },
  barValueToday: {
    color: C.whiteMid,
  },
  highlightCard: {
    backgroundColor: 'rgba(201,168,76,0.10)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.20)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  highlightLeft: {
    flexShrink: 0,
  },
  highlightRight: {
    flex: 1,
    gap: 3,
  },
  highlightTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.2,
  },
  highlightSub: {
    fontSize: 12,
    color: C.whiteDim,
    lineHeight: 17,
  },
  peakRow: {
    gap: 12,
  },
  peakItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  peakTime: {
    fontSize: 13,
    fontWeight: '600',
    color: C.whiteMid,
    width: 72,
    flexShrink: 0,
  },
  peakBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  peakFill: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 3,
  },
  peakCovers: {
    fontSize: 12,
    color: C.whiteDim,
    width: 60,
    textAlign: 'right',
    flexShrink: 0,
  },
});
