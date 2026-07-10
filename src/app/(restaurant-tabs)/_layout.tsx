import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect } from 'react';
import { ColorValue, Platform, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRestaurant } from '@/context/restaurant';

const TAB_BG = '#0D1E38';
const ACTIVE = '#FFFFFF';
const INACTIVE = 'rgba(255,255,255,0.35)';

function Icon({ name, color }: { name: string; color: ColorValue }) {
  if (Platform.OS === 'ios') {
    return <SymbolView name={name as any} tintColor={color as string} style={styles.icon} />;
  }
  return null;
}

function NotificationBanner() {
  const { notification, setNotification } = useRestaurant();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!notification) return;
    const t = setTimeout(() => setNotification(null), 4500);
    return () => clearTimeout(t);
  }, [notification]);

  if (!notification) return null;

  return (
    <Animated.View
      entering={FadeInDown.duration(380).springify()}
      exiting={FadeOut.duration(220)}
      pointerEvents="none"
      style={[styles.banner, { top: insets.top + 12 }]}>
      <View style={styles.bannerDot} />
      <Text style={styles.bannerText}>{notification}</Text>
    </Animated.View>
  );
}

export default function RestaurantTabLayout() {
  return (
    <View style={styles.root}>
      <NotificationBanner />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: TAB_BG,
            borderTopColor: 'rgba(255,255,255,0.07)',
            borderTopWidth: StyleSheet.hairlineWidth,
          },
          tabBarActiveTintColor: ACTIVE,
          tabBarInactiveTintColor: INACTIVE,
          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '600',
            letterSpacing: 0.3,
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <Icon name="chart.bar.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="tables"
          options={{
            title: 'Tables',
            tabBarIcon: ({ color }) => <Icon name="tablecells.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="menu"
          options={{
            title: 'Menu',
            tabBarIcon: ({ color }) => <Icon name="menucard.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => <Icon name="gearshape.fill" color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  icon: {
    width: 22,
    height: 22,
  },
  banner: {
    position: 'absolute',
    left: 16,
    right: 16,
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
  bannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#30D158',
    flexShrink: 0,
  },
  bannerText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
});
