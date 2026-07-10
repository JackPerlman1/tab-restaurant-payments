import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MenuCategory, MenuItem, TableOrder, useRestaurant } from '@/context/restaurant';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  border: 'rgba(255,255,255,0.07)',
  green: '#30D158',
};

const CATEGORIES: { key: MenuCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'starters', label: 'Starters' },
  { key: 'mains', label: 'Mains' },
  { key: 'desserts', label: 'Desserts' },
  { key: 'drinks', label: 'Drinks' },
];

function MenuItemRow({
  item,
  quantity,
  onInc,
  onDec,
}: {
  item: MenuItem;
  quantity: number;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <View style={styles.stepper}>
        <TouchableOpacity
          style={[styles.stepBtn, quantity === 0 && styles.stepBtnDim]}
          onPress={onDec}
          disabled={quantity === 0}>
          <Text style={styles.stepBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={[styles.stepCount, quantity > 0 && styles.stepCountActive]}>
          {quantity}
        </Text>
        <TouchableOpacity style={styles.stepBtn} onPress={onInc}>
          <Text style={styles.stepBtnText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function AddToTableScreen() {
  const { tableId } = useLocalSearchParams<{ tableId: string }>();
  const { tables, menu, addItemsToTable } = useRestaurant();
  const table = tables.find((t) => t.id === tableId);

  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<MenuCategory | 'all'>('all');

  const inc = (id: string) =>
    setQuantities((q) => ({ ...q, [id]: (q[id] ?? 0) + 1 }));
  const dec = (id: string) =>
    setQuantities((q) => ({ ...q, [id]: Math.max(0, (q[id] ?? 0) - 1) }));

  const filteredMenu =
    activeCategory === 'all' ? menu : menu.filter((m) => m.category === activeCategory);

  const selectedItems: TableOrder[] = Object.entries(quantities)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = menu.find((m) => m.id === id)!;
      return { menuItemId: id, name: item.name, price: item.price, quantity: qty };
    });

  const totalAdded = selectedItems.reduce((s, i) => s + i.quantity, 0);
  const totalValue = selectedItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleAdd = () => {
    if (selectedItems.length === 0 || !tableId) return;
    addItemsToTable(tableId, selectedItems);
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.inner}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(0).duration(500)} style={styles.header}>
          <TouchableOpacity style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Add Items</Text>
          <Text style={styles.subtitle}>
            {table ? `Table ${table.number} · ${table.customerName}` : 'Table'}
          </Text>
        </Animated.View>

        {/* Category chips */}
        <Animated.View entering={FadeInDown.delay(80).duration(500)}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catScroll}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.key}
                style={[styles.catChip, activeCategory === cat.key && styles.catChipActive]}
                onPress={() => setActiveCategory(cat.key)}>
                <Text style={[styles.catChipText, activeCategory === cat.key && styles.catChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Menu items */}
        <ScrollView
          style={styles.menuScroll}
          contentContainerStyle={styles.menuContent}
          showsVerticalScrollIndicator={false}>
          {filteredMenu.map((item, i) => (
            <Animated.View
              key={item.id}
              entering={FadeInDown.delay(120 + i * 30).duration(400).springify()}>
              <MenuItemRow
                item={item}
                quantity={quantities[item.id] ?? 0}
                onInc={() => inc(item.id)}
                onDec={() => dec(item.id)}
              />
              {i < filteredMenu.length - 1 && <View style={styles.divider} />}
            </Animated.View>
          ))}
        </ScrollView>

        {/* Sticky add button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.addBtn, totalAdded === 0 && styles.addBtnDisabled]}
            activeOpacity={0.85}
            onPress={handleAdd}
            disabled={totalAdded === 0}>
            <Text style={styles.addBtnText}>
              {totalAdded === 0
                ? 'Select items to add'
                : `Add ${totalAdded} item${totalAdded > 1 ? 's' : ''} — $${totalValue.toFixed(2)}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.navy,
  },
  inner: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 16,
  },
  back: {
    paddingTop: 8,
    paddingBottom: 12,
    alignSelf: 'flex-start',
  },
  backText: {
    color: C.whiteDim,
    fontSize: 15,
    fontWeight: '500',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.4,
    marginBottom: 3,
  },
  subtitle: {
    fontSize: 13,
    color: C.whiteDim,
  },
  catScroll: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  catChipActive: {
    backgroundColor: C.white,
    borderColor: C.white,
  },
  catChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: C.whiteDim,
  },
  catChipTextActive: {
    color: C.navy,
  },
  menuScroll: {
    flex: 1,
  },
  menuContent: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  itemInfo: {
    flex: 1,
    marginRight: 16,
    gap: 3,
  },
  itemName: {
    fontSize: 15,
    color: C.white,
    fontWeight: '400',
  },
  itemPrice: {
    fontSize: 13,
    color: C.whiteDim,
    fontWeight: '500',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.10)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnDim: {
    opacity: 0.3,
  },
  stepBtnText: {
    color: C.white,
    fontSize: 18,
    fontWeight: '300',
    lineHeight: 22,
  },
  stepCount: {
    fontSize: 16,
    fontWeight: '600',
    color: C.whiteDim,
    minWidth: 20,
    textAlign: 'center',
  },
  stepCountActive: {
    color: C.white,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: C.border,
  },
  addBtn: {
    backgroundColor: C.white,
    borderRadius: 14,
    paddingVertical: 17,
    alignItems: 'center',
  },
  addBtnDisabled: {
    opacity: 0.38,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: C.navy,
    letterSpacing: 0.1,
  },
});
