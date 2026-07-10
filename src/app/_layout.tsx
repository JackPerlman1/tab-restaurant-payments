import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider, useAuth } from '@/context/auth';
import { PaymentProvider } from '@/context/payment';
import { RestaurantProvider } from '@/context/restaurant';
import { TabProvider } from '@/context/tab';

function RootLayoutContent() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const inProtected =
      segments[0] === '(customer-tabs)' || segments[0] === '(restaurant-tabs)';
    if (!user && inProtected) {
      router.dismissAll();
    }
  }, [user, segments]);

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0B1426' },
          animation: 'ios_from_right',
        }}>
        <Stack.Screen name="(customer-tabs)" options={{ animation: 'fade' }} />
        <Stack.Screen name="(restaurant-tabs)" options={{ animation: 'fade' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <PaymentProvider>
        <TabProvider>
          <RestaurantProvider>
            <RootLayoutContent />
          </RestaurantProvider>
        </TabProvider>
      </PaymentProvider>
    </AuthProvider>
  );
}
