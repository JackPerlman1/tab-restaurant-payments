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

export default function RestaurantLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { focused, setFocused } = useFormFocus();
  const { restaurantLogin } = useAuth();

  const handleLogin = () => {
    restaurantLogin(email.trim(), password);
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
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to manage your venue</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).duration(600).springify()} style={styles.form}>
            <AuthField
              label="Email"
              focusKey="email"
              activeFocus={focused}
              onFocusChange={setFocused}
              placeholder="restaurant@example.com"
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
              onSubmitEditing={handleLogin}
            />
            <AuthButton title="Log In" onPress={handleLogin} />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(380).duration(500)}>
            <AuthFooter
              message="New restaurant? "
              linkText="Sign up"
              onPress={() => router.replace('/restaurant/signup')}
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
