import React, {useMemo, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch} from 'react-redux';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../../navigation/types';
import AppButton from '../../components/AppButton';
import AppTextInput from '../../components/AppTextInput';
import CityPicker from '../../components/CityPicker';
import RadioGroup from '../../components/RadioGroup';
import ScreenContainer from '../../components/ScreenContainer';
import {showToast} from '../../components/Toast';
import {AVATAR_OPTIONS} from '../../constants/avatars';
import {loginSuccess} from '../../redux/slices/authSlice';
import {setProfile} from '../../redux/slices/profileSlice';
import type {AppDispatch} from '../../redux/store';
import {register as registerApi} from '../../services/authApi';
import {saveAuthSession} from '../../services/authStorage';
import {useTheme} from '../../theme/ThemeContext';
import type {Gender} from '../../types/user';
import {validateRegister} from '../../utils/validation/authValidation';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({navigation}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {colors} = useTheme();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(AVATAR_OPTIONS[0]);
  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const formValues = useMemo(
    () => ({
      name,
      email,
      password,
      confirmPassword,
      gender: gender ?? '',
      mobile,
      address,
      city,
    }),
    [name, email, password, confirmPassword, gender, mobile, address, city],
  );

  function onMobileChange(value: string) {
    setMobile(value.replace(/\D/g, '').slice(0, 10));
  }

  async function onSubmit() {
    const validationErrors = validateRegister(formValues);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSubmitting(true);
      const res = await registerApi({
        name: formValues.name,
        email: formValues.email,
        password: formValues.password,
        gender: gender as Gender,
        mobile: formValues.mobile,
        address: formValues.address,
        city: formValues.city,
        avatarUrl,
      });

      await saveAuthSession({token: res.token, userId: res.userId});
      dispatch(loginSuccess({token: res.token, userId: res.userId}));
      dispatch(setProfile(res.profile));

      showToast({message: 'Account created successfully!', type: 'success'});
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Registration failed.';
      showToast({message, type: 'error'});
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <Text style={[styles.title, {color: colors.text}]}>Create Account</Text>
      <Text style={[styles.subtitle, {color: colors.textSecondary}]}>
        Fill in your details to get started
      </Text>

      <Text style={[styles.sectionLabel, {color: colors.text}]}>Choose Avatar</Text>
      <View style={styles.avatarRow}>
        {AVATAR_OPTIONS.map(url => {
          const selected = avatarUrl === url;
          return (
            <Pressable
              key={url}
              onPress={() => setAvatarUrl(url)}
              accessibilityRole="button"
              accessibilityState={{selected}}
              style={[
                styles.avatarButton,
                {
                  borderColor: selected ? colors.primary : colors.border,
                },
              ]}>
              <Image source={{uri: url}} style={styles.avatarImage} />
            </Pressable>
          );
        })}
      </View>

      <AppTextInput
        label="Full Name"
        placeholder="Enter your name"
        value={name}
        onChangeText={setName}
        error={errors.name}
        autoCapitalize="words"
      />

      <AppTextInput
        label="Email"
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        error={errors.email}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <RadioGroup
        label="Gender"
        value={gender}
        onChange={setGender}
        error={errors.gender}
      />

      <AppTextInput
        label="Mobile"
        placeholder="10-digit mobile number"
        value={mobile}
        onChangeText={onMobileChange}
        error={errors.mobile}
        keyboardType="number-pad"
        maxLength={10}
      />

      <AppTextInput
        label="Address"
        placeholder="Enter your address"
        value={address}
        onChangeText={setAddress}
        error={errors.address}
        multiline
      />

      <CityPicker
        label="City"
        value={city}
        onChange={setCity}
        error={errors.city}
      />

      <AppTextInput
        label="Password"
        placeholder="At least 6 characters"
        value={password}
        onChangeText={setPassword}
        error={errors.password}
        secureTextEntry
      />

      <AppTextInput
        label="Confirm Password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        error={errors.confirmPassword}
        secureTextEntry
      />

      <AppButton
        title="Create Account"
        onPress={onSubmit}
        loading={submitting}
        style={styles.submitButton}
      />

      <AppButton
        title="Already have an account? Login"
        onPress={() => navigation.navigate('Login')}
        variant="secondary"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  avatarButton: {
    borderWidth: 2,
    borderRadius: 28,
    padding: 2,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  submitButton: {
    marginBottom: 12,
  },
});
