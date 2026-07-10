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

export default function CustomerLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { focused, setFocused } = useFormFocus();
  const { customerLogin } = useAuth();

  const handleLogin = () => {
    customerLogin(email.trim(), password);
    router.replace('/(customer-tabs)');
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
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Log in to your account</Text>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(220).duration(600).springify()} style={styles.form}>
            <AuthField
              label="Email"
              focusKey="email"
              activeFocus={focused}
              onFocusChange={setFocused}
              placeholder="you@example.com"
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
              message="Don't have an account? "
              linkText="Sign up"
              onPress={() => router.replace('/customer/signup')}
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
    gap: 8,
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
