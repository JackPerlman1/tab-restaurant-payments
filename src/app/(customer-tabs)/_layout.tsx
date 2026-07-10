import { Tabs } from 'expo-router';
import { ColorValue, Platform, StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';

const TAB_BG = '#0D1E38';
const ACTIVE = '#FFFFFF';
const INACTIVE = 'rgba(255,255,255,0.35)';

function Icon({ name, color }: { name: string; color: ColorValue }) {
  if (Platform.OS === 'ios') {
    return <SymbolView name={name as any} tintColor={color as string} style={styles.icon} />;
  }
  return null;
}

export default function CustomerTabLayout() {
  return (
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
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="active-tab"
        options={{
          title: 'Active Tab',
          tabBarIcon: ({ color }) => <Icon name="creditcard.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="past-meals"
        options={{
          title: 'Past Meals',
          tabBarIcon: ({ color }) => <Icon name="clock.fill" color={color} />,
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
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 22,
    height: 22,
  },
});
