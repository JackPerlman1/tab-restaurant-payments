import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AuthButton,
  AuthField,
  AuthFooter,
  BackButton,
  C,
  useFormFocus,
} from '@/components/auth-form';
import { useAuth } from '@/context/auth';

export default function RestaurantSignupScreen() {
  const [restaurantName, setRestaurantName] = useState('');
  const [address, setAddress] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { focused, setFocused } = useFormFocus();
  const { restaurantSignup } = useAuth();

  const handleSignup = () => {
    restaurantSignup(restaurantName.trim(), address.trim(), ownerName.trim(), email.trim(), password);
    router.replace('/(restaurant-tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <BackButton onPress={() => router.back()} />

          <Animated.View entering={FadeInDown.delay(80).duration(600).springify()} style={styles.header}>
            <Text style={styles.eyebrow}>Restaurant</Text>
            <Text style={styles.title}>Get started</Text>
            <Text style={styles.subtitle}>List your venue on Tab</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).duration(600).springify()} style={styles.form}>
            <AuthField
              label="Restaurant Name"
              focusKey="restaurantName"
              activeFocus={focused}
              onFocusChange={setFocused}
              placeholder="e.g. The Golden Fork"
              value={restaurantName}
              onChangeText={setRestaurantName}
              returnKeyType="next"
            />
            <AuthField
              label="Address"
              focusKey="address"
              activeFocus={focused}
              onFocusChange={setFocused}
              placeholder="123 Main St, New York, NY"
              value={address}
              onChangeText={setAddress}
              autoComplete="street-address"
              returnKeyType="next"
            />
            <AuthField
              label="Owner Name"
              focusKey="ownerName"
              activeFocus={focused}
              onFocusChange={setFocused}
              placeholder="Your full name"
              value={ownerName}
              onChangeText={setOwnerName}
              autoComplete="name"
              returnKeyType="next"
            />
            <AuthField
              label="Email"
              focusKey="email"
              activeFocus={focused}
              onFocusChange={setFocused}
              placeholder="hello@restaurant.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next"
            />
            <AuthField
              label="Password"
              focusKey="password"
              activeFocus={focused}
              onFocusChange={setFocused}
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
            <AuthButton title="Create Restaurant Account" onPress={handleSignup} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(380).duration(500)}>
            <AuthFooter
              message="Already registered? "
              linkText="Log in"
              onPress={() => router.replace('/restaurant/login')}
            />
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: C.navy,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 40,
    gap: 6,
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: '600',
    color: C.whiteDim,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    fontWeight: '700',
    color: C.white,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: C.whiteDim,
  },
  form: {
    gap: 20,
    marginBottom: 32,
  },
});
