import React, {useMemo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../../navigation/types';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import AppTextInput from '../../components/AppTextInput';
import ScreenContainer from '../../components/ScreenContainer';
import {showToast} from '../../components/Toast';
import {loginSuccess} from '../../redux/slices/authSlice';
import {setProfile} from '../../redux/slices/profileSlice';
import type {AppDispatch} from '../../redux/store';
import {login as loginApi} from '../../services/authApi';
import {saveAuthSession} from '../../services/authStorage';
import {useTheme} from '../../theme/ThemeContext';
import {validateLogin} from '../../utils/validation/authValidation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({navigation}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {colors} = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formValues = useMemo(() => ({email, password}), [email, password]);

  async function onSubmit() {
    const validationErrors = validateLogin(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSubmitting(true);
      const res = await loginApi({
        email: formValues.email,
        password: formValues.password,
      });

      await saveAuthSession({token: res.token, userId: res.userId});
      dispatch(loginSuccess({token: res.token, userId: res.userId}));
      dispatch(setProfile(res.profile));
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Login failed.';
      showToast({message, type: 'error'});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <Text style={[styles.brand, {color: colors.primary}]}>Gallery</Text>
        <Text style={[styles.title, {color: colors.text}]}>Welcome back</Text>
        <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
          Sign in to explore and save your favorite images
        </Text>
      </View>

      <AppCard style={styles.card}>
        <AppTextInput
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <AppTextInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
        />

        <AppButton title="Sign In" onPress={onSubmit} loading={submitting} />
      </AppCard>

      <View style={styles.footer}>
        <Text style={[styles.footerText, {color: colors.textSecondary}]}>
          Don&apos;t have an account?
        </Text>
        <AppButton
          title="Create Account"
          onPress={() => navigation.navigate('Register')}
          variant="secondary"
          style={styles.registerButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  hero: {
    marginBottom: 24,
  },
  brand: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
  },
  card: {
    marginBottom: 20,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 12,
  },
  registerButton: {
    alignSelf: 'stretch',
  },
});
