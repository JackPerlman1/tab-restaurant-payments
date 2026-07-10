import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import * as Haptics from 'expo-haptics';
import {
  Keyboard,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import {
  ClosedTable,
  fmt,
  fmtTime,
  lookupMemberById,
  tableSubtotal,
  tableTax,
  tableTotal,
  useRestaurant,
} from '@/context/restaurant';
import { PressableScale } from '@/components/pressable-scale';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  navyDeep: '#07101F',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  whiteMid: 'rgba(255,255,255,0.70)',
  border: 'rgba(255,255,255,0.07)',
  borderFocus: 'rgba(255,255,255,0.28)',
  green: '#30D158',
  amber: '#FF9F0A',
};

type TabView = 'active' | 'closed';

function minutesSince(ts: number): number {
  return Math.floor((Date.now() - ts) / 60000);
}

function ChevronIcon({ color }: { color: string }) {
  if (Platform.OS === 'ios') {
    return <SymbolView name="chevron.right" tintColor={color} style={{ width: 14, height: 14 }} />;
  }
  return <Text style={{ color, fontSize: 16, fontWeight: '300' }}>›</Text>;
}

function statusDotColor(status: string): string {
  if (status === 'paid') return C.green;
  if (status === 'bill_sent') return C.amber;
  return 'rgba(255,255,255,0.30)';
}

function statusLabel(status: string): string {
  if (status === 'paid') return 'Paid';
  if (status === 'bill_sent') return 'Awaiting';
  return 'Open';
}

function SegmentedControl({
  value,
  onChange,
  activeCount,
  closedCount,
}: {
  value: TabView;
  onChange: (v: TabView) => void;
  activeCount: number;
  closedCount: number;
}) {
  return (
    <View style={seg.container}>
      <TouchableOpacity
        style={[seg.segment, value === 'active' && seg.segmentActive]}
        activeOpacity={0.8}
        onPress={() => onChange('active')}>
        <Text style={[seg.label, value === 'active' && seg.labelActive]}>
          Active
        </Text>
        {activeCount > 0 && (
          <View style={[seg.badge, value === 'active' && seg.badgeActive]}>
            <Text style={[seg.badgeText, value === 'active' && seg.badgeTextActive]}>
              {activeCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        style={[seg.segment, value === 'closed' && seg.segmentActive]}
        activeOpacity={0.8}
        onPress={() => onChange('closed')}>
        <Text style={[seg.label, value === 'closed' && seg.labelActive]}>
          Closed
        </Text>
        {closedCount > 0 && (
          <View style={[seg.badge, value === 'closed' && seg.badgeActive]}>
            <Text style={[seg.badgeText, value === 'closed' && seg.badgeTextActive]}>
              {closedCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const seg = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 3,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.border,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 10,
  },
  segmentActive: {
    backgroundColor: C.white,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: C.whiteDim,
  },
  labelActive: {
    color: C.navy,
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    minWidth: 18,
    alignItems: 'center',
  },
  badgeActive: {
    backgroundColor: 'rgba(11,20,38,0.15)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
  },
  badgeTextActive: {
    color: C.navy,
  },
});

function ClosedSummaryRow({ tables }: { tables: ClosedTable[] }) {
  const totalCollected = tables.reduce((sum, t) => {
    return sum + tableTotal(t.orders) + t.tipAmount;
  }, 0);
  return (
    <View style={styles.summaryRow}>
      <View style={styles.summaryItem}>
        <Text style={styles.summaryValue}>{tables.length}</Text>
        <Text style={styles.summaryLabel}>tables closed</Text>
      </View>
      <View style={styles.summaryDivider} />
      <View style={styles.summaryItem}>
        <Text style={styles.summaryValue}>${fmt(totalCollected)}</Text>
        <Text style={styles.summaryLabel}>collected today</Text>
      </View>
    </View>
  );
}

function ClosedTableRow({ table }: { table: ClosedTable }) {
  const grandTotal = tableTotal(table.orders) + table.tipAmount;
  return (
    <PressableScale
      style={styles.tableRow}
      onPress={() => router.push(`/restaurant/closed-table/${table.id}`)}>
      <View style={styles.tableRowLeft}>
        <View style={styles.tableNum}>
          <Text style={styles.tableNumText}>{table.number}</Text>
        </View>
        <View style={styles.tableRowInfo}>
          <Text style={styles.tableName} numberOfLines={1}>{table.customerName}</Text>
          <View style={styles.tableRowMeta}>
            <Text style={styles.closedTime}>{fmtTime(table.closedAt)}</Text>
            <Text style={styles.dotSep}>·</Text>
            <View style={styles.tipBadge}>
              <Text style={styles.tipBadgeText}>{table.tipPercentage}% tip</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.tableRowRight}>
        <Text style={styles.tableTotal}>${fmt(grandTotal)}</Text>
        <ChevronIcon color="rgba(255,255,255,0.25)" />
      </View>
    </PressableScale>
  );
}

export default function TablesScreen() {
  const { tables, closedTables, openNewTable } = useRestaurant();
  const [view, setView] = useState<TabView>('active');
  const [showModal, setShowModal] = useState(false);
  const [memberId, setMemberId] = useState('');
  const [lookupName, setLookupName] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (memberId.length === 6) {
      setLookupName(lookupMemberById(memberId));
    } else {
      setLookupName(null);
    }
  }, [memberId]);

  const openModal = () => {
    setMemberId('');
    setLookupName(null);
    setShowModal(true);
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const closeModal = () => {
    Keyboard.dismiss();
    setShowModal(false);
    setMemberId('');
    setLookupName(null);
  };

  const confirmOpen = () => {
    if (!lookupName) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    openNewTable(memberId, lookupName);
    closeModal();
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  };

  const activeTables = tables;
  const subtitle = view === 'active'
    ? `${activeTables.length} active`
    : `${closedTables.length} closed today`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
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
          <Text style={styles.title}>Tables</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <SegmentedControl
            value={view}
            onChange={setView}
            activeCount={activeTables.length}
            closedCount={closedTables.length}
          />
        </Animated.View>

        {view === 'active' ? (
          <>
            <Animated.View entering={FadeInDown.delay(140).duration(500)}>
              <TouchableOpacity style={styles.openBtn} activeOpacity={0.82} onPress={openModal}>
                <Text style={styles.openBtnText}>+ Open New Tab</Text>
              </TouchableOpacity>
            </Animated.View>

            <View style={styles.tableList}>
              {activeTables.map((table, i) => (
                <Animated.View
                  key={table.id}
                  entering={FadeInDown.delay(180 + i * 60).duration(500).springify()}>
                  <PressableScale
                    style={styles.tableRow}
                    onPress={() => router.push(`/restaurant/table/${table.id}`)}>
                    <View style={styles.tableRowLeft}>
                      <View style={styles.tableNum}>
                        <Text style={styles.tableNumText}>{table.number}</Text>
                      </View>
                      <View style={styles.tableRowInfo}>
                        <Text style={styles.tableName}>{table.customerName}</Text>
                        <View style={styles.tableRowMeta}>
                          <View style={[styles.statusDot, { backgroundColor: statusDotColor(table.status) }]} />
                          <Text style={[styles.statusText, { color: statusDotColor(table.status) }]}>
                            {statusLabel(table.status)}
                          </Text>
                          <Text style={styles.dotSep}>·</Text>
                          <Text style={styles.tableTime}>{minutesSince(table.seatedAt)} min</Text>
                        </View>
                      </View>
                    </View>
                    <View style={styles.tableRowRight}>
                      <Text style={styles.tableTotal}>${fmt(tableTotal(table.orders))}</Text>
                      <ChevronIcon color="rgba(255,255,255,0.25)" />
                    </View>
                  </PressableScale>
                </Animated.View>
              ))}
            </View>
          </>
        ) : (
          <>
            {closedTables.length > 0 && (
              <Animated.View entering={FadeInDown.delay(140).duration(500)}>
                <ClosedSummaryRow tables={closedTables} />
              </Animated.View>
            )}

            {closedTables.length === 0 ? (
              <Animated.View entering={FadeInDown.delay(160).duration(500)} style={styles.emptyState}>
                <Text style={styles.emptyTitle}>No closed tables yet</Text>
                <Text style={styles.emptySubtitle}>Completed tables will appear here</Text>
              </Animated.View>
            ) : (
              <View style={styles.tableList}>
                {closedTables.map((table, i) => (
                  <Animated.View
                    key={table.id}
                    entering={FadeInDown.delay(180 + i * 55).duration(500).springify()}>
                    <ClosedTableRow table={table} />
                  </Animated.View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Open Tab Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeModal}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={closeModal}>
          <TouchableOpacity activeOpacity={1} onPress={Keyboard.dismiss}>
            <Animated.View
              entering={FadeInUp.duration(280).springify()}
              style={styles.modalCard}>
              {!lookupName ? (
                <>
                  <Text style={styles.modalTitle}>Enter Member ID</Text>
                  <Text style={styles.modalSub}>Customer's 6-digit Tab ID</Text>

                  <TextInput
                    ref={inputRef}
                    style={styles.memberInput}
                    value={memberId}
                    onChangeText={(t) => setMemberId(t.replace(/\D/g, '').slice(0, 6))}
                    keyboardType="number-pad"
                    maxLength={6}
                    placeholder="000000"
                    placeholderTextColor="rgba(255,255,255,0.20)"
                    selectionColor={C.white}
                  />

                  <Text style={styles.modalHint}>
                    {memberId.length}/6 digits{memberId.length > 0 && memberId.length < 6 ? ' — keep typing' : ''}
                  </Text>

                  <TouchableOpacity style={styles.cancelBtn} onPress={closeModal}>
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.foundAvatar}>
                    <Text style={styles.foundAvatarText}>{lookupName.charAt(0)}</Text>
                  </View>
                  <Text style={styles.foundLabel}>Customer Found</Text>
                  <Text style={styles.foundName}>{lookupName}</Text>
                  <Text style={styles.foundId}>Member ID {memberId}</Text>

                  <Text style={styles.confirmQuestion}>Open a new tab?</Text>

                  <TouchableOpacity style={styles.confirmBtn} activeOpacity={0.85} onPress={confirmOpen}>
                    <Text style={styles.confirmBtnText}>Open Tab</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.backLink} onPress={() => { setMemberId(''); setLookupName(null); }}>
                    <Text style={styles.backLinkText}>Enter different ID</Text>
                  </TouchableOpacity>
                </>
              )}
            </Animated.View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
    marginBottom: 20,
    gap: 3,
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
  openBtn: {
    backgroundColor: C.white,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  openBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.navy,
    letterSpacing: 0.1,
  },
  tableList: {
    gap: 8,
  },
  tableRow: {
    backgroundColor: C.navyCard,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: C.border,
  },
  tableRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  tableNum: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  tableNumText: {
    fontSize: 17,
    fontWeight: '700',
    color: C.white,
  },
  tableRowInfo: {
    gap: 4,
    flex: 1,
  },
  tableName: {
    fontSize: 16,
    fontWeight: '600',
    color: C.white,
    letterSpacing: -0.1,
  },
  tableRowMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
  dotSep: {
    color: 'rgba(255,255,255,0.20)',
    fontSize: 12,
  },
  tableTime: {
    fontSize: 12,
    color: C.whiteDim,
  },
  tableRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  tableTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.2,
    maxWidth: 80,
  },
  // Closed view
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: C.navyCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.3,
  },
  summaryLabel: {
    fontSize: 11,
    color: C.whiteDim,
    fontWeight: '500',
  },
  closedTime: {
    fontSize: 12,
    color: C.whiteDim,
  },
  tipBadge: {
    backgroundColor: 'rgba(48,209,88,0.12)',
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tipBadgeText: {
    fontSize: 11,
    color: C.green,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: C.white,
  },
  emptySubtitle: {
    fontSize: 13,
    color: C.whiteDim,
  },
  // Modal
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalCard: {
    backgroundColor: '#0F1E35',
    borderRadius: 22,
    padding: 28,
    width: '100%',
    maxWidth: 360,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.09)',
    alignItems: 'center',
    gap: 0,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  modalSub: {
    fontSize: 14,
    color: C.whiteDim,
    marginBottom: 24,
  },
  memberInput: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.borderFocus,
    fontSize: 34,
    fontWeight: '700',
    color: C.white,
    textAlign: 'center',
    letterSpacing: 10,
    paddingVertical: 18,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  modalHint: {
    fontSize: 12,
    color: C.whiteDim,
    marginBottom: 24,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  cancelBtnText: {
    color: C.whiteDim,
    fontSize: 15,
    fontWeight: '500',
  },
  foundAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(48,209,88,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  foundAvatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: C.green,
  },
  foundLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: C.green,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  foundName: {
    fontSize: 26,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  foundId: {
    fontSize: 13,
    color: C.whiteDim,
    fontWeight: '500',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  confirmQuestion: {
    fontSize: 14,
    color: C.whiteDim,
    marginBottom: 16,
  },
  confirmBtn: {
    backgroundColor: C.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 48,
    alignItems: 'center',
    marginBottom: 4,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.navy,
    letterSpacing: 0.1,
  },
  backLink: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backLinkText: {
    fontSize: 14,
    color: C.whiteDim,
    fontWeight: '500',
  },
});
