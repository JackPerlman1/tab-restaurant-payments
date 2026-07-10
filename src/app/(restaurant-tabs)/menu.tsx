import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useState } from 'react';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SymbolView } from 'expo-symbols';

import { MenuCategory, MenuItem, useRestaurant } from '@/context/restaurant';

const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  whiteMid: 'rgba(255,255,255,0.70)',
  border: 'rgba(255,255,255,0.07)',
  borderFocus: 'rgba(255,255,255,0.28)',
  red: '#FF453A',
};

const CATEGORIES: { key: MenuCategory; label: string }[] = [
  { key: 'starters', label: 'Starters' },
  { key: 'mains', label: 'Mains' },
  { key: 'desserts', label: 'Desserts' },
  { key: 'drinks', label: 'Drinks' },
];

function TrashIcon() {
  if (Platform.OS === 'ios') {
    return <SymbolView name="trash" tintColor={C.red} style={{ width: 18, height: 18 }} />;
  }
  return <Text style={{ color: C.red, fontSize: 16 }}>🗑</Text>;
}

function MenuItemRow({ item, onDelete }: { item: MenuItem; onDelete: () => void }) {
  return (
    <View style={styles.itemRow}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <TrashIcon />
      </TouchableOpacity>
    </View>
  );
}

type AddItemState = {
  name: string;
  price: string;
  category: MenuCategory;
};

export default function MenuScreen() {
  const { menu, addMenuItem, deleteMenuItem } = useRestaurant();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<AddItemState>({ name: '', price: '', category: 'starters' });

  const isValid = form.name.trim().length > 0 && parseFloat(form.price) > 0;

  const handleAdd = () => {
    if (!isValid) return;
    addMenuItem({
      name: form.name.trim(),
      price: parseFloat(form.price),
      category: form.category,
    });
    setForm({ name: '', price: '', category: 'starters' });
    setShowForm(false);
  };

  const grouped = CATEGORIES.map((cat) => ({
    ...cat,
    items: menu.filter((m) => m.category === cat.key),
  })).filter((g) => g.items.length > 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.delay(60).duration(600).springify()} style={styles.header}>
          <Text style={styles.title}>Menu</Text>
          <Text style={styles.subtitle}>{menu.length} items</Text>
        </Animated.View>

        {/* Add Item toggle */}
        <Animated.View entering={FadeInDown.delay(120).duration(500)}>
          <TouchableOpacity
            style={[styles.addToggle, showForm && styles.addToggleActive]}
            activeOpacity={0.8}
            onPress={() => setShowForm((v) => !v)}>
            <Text style={[styles.addToggleText, showForm && styles.addToggleTextActive]}>
              {showForm ? '✕ Cancel' : '+ New Item'}
            </Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Add Item form */}
        {showForm && (
          <Animated.View entering={ZoomIn.duration(250)} style={styles.formCard}>
            <TextInput
              style={styles.formInput}
              placeholder="Item name"
              placeholderTextColor="rgba(255,255,255,0.30)"
              value={form.name}
              onChangeText={(t) => setForm((f) => ({ ...f, name: t }))}
              selectionColor={C.white}
            />
            <View style={styles.formRow}>
              <View style={[styles.formInput, styles.formPriceWrap]}>
                <Text style={styles.formDollar}>$</Text>
                <TextInput
                  style={styles.formPriceInput}
                  placeholder="0.00"
                  placeholderTextColor="rgba(255,255,255,0.30)"
                  value={form.price}
                  onChangeText={(t) => setForm((f) => ({ ...f, price: t.replace(/[^0-9.]/g, '') }))}
                  keyboardType="decimal-pad"
                  selectionColor={C.white}
                />
              </View>
            </View>

            {/* Category chips */}
            <Text style={styles.formLabel}>CATEGORY</Text>
            <View style={styles.catChips}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.catChip, form.category === cat.key && styles.catChipActive]}
                  onPress={() => setForm((f) => ({ ...f, category: cat.key }))}>
                  <Text style={[styles.catChipText, form.category === cat.key && styles.catChipTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={[styles.addBtn, !isValid && styles.addBtnDisabled]}
              activeOpacity={0.85}
              onPress={handleAdd}
              disabled={!isValid}>
              <Text style={styles.addBtnText}>Add to Menu</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* Empty state */}
        {grouped.length === 0 && !showForm && (
          <Animated.View entering={FadeInDown.delay(200).duration(500)} style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              {Platform.OS === 'ios' ? (
                <SymbolView name="fork.knife" tintColor="rgba(255,255,255,0.22)" style={{ width: 36, height: 36 }} />
              ) : (
                <Text style={styles.emptyEmoji}>🍽</Text>
              )}
            </View>
            <Text style={styles.emptyTitle}>Your menu is empty</Text>
            <Text style={styles.emptySubtitle}>Add your first dish to get started</Text>
          </Animated.View>
        )}

        {/* Menu by category */}
        {grouped.map((group, gi) => (
          <Animated.View
            key={group.key}
            entering={FadeInDown.delay(180 + gi * 60).duration(500).springify()}>
            <Text style={styles.catHeader}>{group.label.toUpperCase()}</Text>
            <View style={styles.catCard}>
              {group.items.map((item, ii) => (
                <View key={item.id}>
                  <MenuItemRow item={item} onDelete={() => deleteMenuItem(item.id)} />
                  {ii < group.items.length - 1 && <View style={styles.divider} />}
                </View>
              ))}
            </View>
          </Animated.View>
        ))}
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
  addToggle: {
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  addToggleActive: {
    borderColor: 'rgba(255,255,255,0.08)',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  addToggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
  addToggleTextActive: {
    color: C.whiteDim,
  },
  formCard: {
    backgroundColor: C.navyCard,
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    gap: 12,
  },
  formInput: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: C.white,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
  },
  formPriceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  formDollar: {
    color: C.whiteDim,
    fontSize: 15,
    fontWeight: '500',
    marginRight: 4,
  },
  formPriceInput: {
    flex: 1,
    fontSize: 15,
    color: C.white,
    paddingVertical: 14,
  },
  formLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.5,
    marginBottom: -4,
  },
  catChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
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
  addBtn: {
    backgroundColor: C.white,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
  },
  addBtnDisabled: {
    opacity: 0.38,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: C.navy,
  },
  catHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: C.whiteDim,
    letterSpacing: 1.5,
    marginBottom: 8,
    marginTop: 8,
  },
  catCard: {
    backgroundColor: C.navyCard,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  itemInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginRight: 12,
  },
  itemName: {
    fontSize: 15,
    color: C.white,
    fontWeight: '400',
    flex: 1,
    marginRight: 12,
  },
  itemPrice: {
    fontSize: 15,
    color: C.whiteDim,
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 4,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: C.border,
    marginLeft: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 32,
    gap: 12,
  },
  emptyIcon: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  emptyEmoji: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 14,
    color: C.whiteDim,
    textAlign: 'center',
  },
});
