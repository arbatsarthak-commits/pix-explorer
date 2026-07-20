import React, {useCallback, useEffect, useState} from 'react';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';

import type {RootStackParamList} from '../../navigation/types';
import AppButton from '../../components/AppButton';
import AppCard from '../../components/AppCard';
import AppHeader from '../../components/AppHeader';
import AppTextInput from '../../components/AppTextInput';
import CityPicker from '../../components/CityPicker';
import RadioGroup from '../../components/RadioGroup';
import ScreenContainer from '../../components/ScreenContainer';
import {showToast} from '../../components/Toast';
import {AVATAR_OPTIONS} from '../../constants/avatars';
import {setProfile} from '../../redux/slices/profileSlice';
import type {AppDispatch, RootState} from '../../redux/store';
import {updateUserProfile} from '../../services/usersStorage';
import {useTheme} from '../../theme/ThemeContext';
import type {Gender} from '../../types/user';
import {performLogout} from '../../utils/auth/logout';
import {validateProfile} from '../../utils/validation/authValidation';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({}: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const {colors} = useTheme();
  const profile = useSelector((s: RootState) => s.profile.profile);
  const userId = useSelector((s: RootState) => s.auth.userId);

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [mobile, setMobile] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!profile) return;
    setName(profile.name);
    setGender(profile.gender);
    setMobile(profile.mobile);
    setAddress(profile.address);
    setCity(profile.city);
    setAvatarUrl(profile.avatarUrl);
  }, [profile]);

  const onMobileChange = useCallback((value: string) => {
    setMobile(value.replace(/\D/g, '').slice(0, 10));
  }, []);

  const resetFormFromProfile = useCallback(() => {
    if (!profile) return;
    setName(profile.name);
    setGender(profile.gender);
    setMobile(profile.mobile);
    setAddress(profile.address);
    setCity(profile.city);
    setAvatarUrl(profile.avatarUrl);
    setErrors({});
  }, [profile]);

  const onCancelEdit = useCallback(() => {
    resetFormFromProfile();
    setEditing(false);
  }, [resetFormFromProfile]);

  const onSave = useCallback(async () => {
    if (!userId || !gender) return;

    const validationErrors = validateProfile({
      name,
      gender,
      mobile,
      address,
      city,
    });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      setSaving(true);
      const updated = await updateUserProfile(userId, {
        name: name.trim(),
        gender,
        mobile,
        address: address.trim(),
        city,
        avatarUrl,
      });
      dispatch(setProfile(updated));
      setEditing(false);
      showToast({message: 'Profile updated', type: 'success'});
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed to save profile';
      showToast({message, type: 'error'});
    } finally {
      setSaving(false);
    }
  }, [address, avatarUrl, city, dispatch, gender, mobile, name, userId]);

  const onLogout = useCallback(async () => {
    try {
      setLoggingOut(true);
      await performLogout(dispatch);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Logout failed';
      showToast({message, type: 'error'});
    } finally {
      setLoggingOut(false);
    }
  }, [dispatch]);

  if (!profile) {
    return (
      <ScreenContainer>
        <AppHeader title="Profile" activeRoute="Profile" />
        <View style={styles.centered}>
          <Text style={[styles.emptyText, {color: colors.textSecondary}]}>
            No profile loaded
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable contentContainerStyle={styles.content}>
      <AppHeader title="Profile" activeRoute="Profile" />

      <AppCard style={styles.card}>
        <View style={styles.avatarSection}>
          {avatarUrl ? (
            <Image source={{uri: avatarUrl}} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, {backgroundColor: colors.skeleton}]}>
              <Text style={[styles.avatarInitial, {color: colors.text}]}>
                {profile.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
          <Text style={[styles.displayName, {color: colors.text}]}>
            {editing ? name : profile.name}
          </Text>
          <Text style={[styles.email, {color: colors.textSecondary}]}>
            {profile.email}
          </Text>
        </View>

        {editing ? (
          <>
            <Text style={[styles.sectionLabel, {color: colors.text}]}>Avatar</Text>
            <View style={styles.avatarPicker}>
              {AVATAR_OPTIONS.map(url => {
                const selected = avatarUrl === url;
                return (
                  <Pressable
                    key={url}
                    onPress={() => setAvatarUrl(url)}
                    accessibilityRole="button"
                    accessibilityState={{selected}}
                    style={[
                      styles.avatarOption,
                      {borderColor: selected ? colors.primary : colors.border},
                    ]}>
                    <Image source={{uri: url}} style={styles.avatarThumb} />
                  </Pressable>
                );
              })}
            </View>

            <AppTextInput
              label="Name"
              value={name}
              onChangeText={setName}
              error={errors.name}
              autoCapitalize="words"
            />

            <RadioGroup label="Gender" value={gender} onChange={setGender} />
            {errors.gender ? (
              <Text style={[styles.fieldError, {color: colors.error}]}>
                {errors.gender}
              </Text>
            ) : null}

            <AppTextInput
              label="Mobile"
              value={mobile}
              onChangeText={onMobileChange}
              error={errors.mobile}
              keyboardType="number-pad"
              maxLength={10}
            />

            <AppTextInput
              label="Address"
              value={address}
              onChangeText={setAddress}
              error={errors.address}
              multiline
            />

            <CityPicker label="City" value={city} onChange={setCity} />
            {errors.city ? (
              <Text style={[styles.fieldError, {color: colors.error}]}>
                {errors.city}
              </Text>
            ) : null}

            <AppButton title="Save Changes" onPress={onSave} loading={saving} />
            <AppButton
              title="Cancel"
              onPress={onCancelEdit}
              variant="secondary"
              style={styles.cancelButton}
            />
          </>
        ) : (
          <>
            <InfoRow label="Full Name" value={profile.name} colors={colors} />
            <InfoRow label="Email" value={profile.email} colors={colors} />
            <InfoRow label="Gender" value={profile.gender} colors={colors} />
            <InfoRow label="Mobile" value={profile.mobile} colors={colors} />
            <InfoRow label="Address" value={profile.address} colors={colors} />
            <InfoRow label="City" value={profile.city} colors={colors} />

            <AppButton
              title="Edit Profile"
              onPress={() => setEditing(true)}
              style={styles.editButton}
            />
          </>
        )}
      </AppCard>

      <View style={styles.logoutWrap}>
        <AppButton
          title="Logout"
          onPress={onLogout}
          variant="danger"
          loading={loggingOut}
        />
      </View>
    </ScreenContainer>
  );
}

function InfoRow({
  label,
  value,
  colors,
}: {
  label: string;
  value: string;
  colors: {text: string; textSecondary: string};
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, {color: colors.textSecondary}]}>{label}</Text>
      <Text
        style={[
          styles.infoValue,
          {color: colors.text},
          label === 'Gender' && styles.capitalize,
        ]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
  },
  card: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarInitial: {
    fontSize: 32,
    fontWeight: '700',
  },
  displayName: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  avatarPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  avatarOption: {
    borderWidth: 2,
    borderRadius: 24,
    padding: 2,
  },
  avatarThumb: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  logoutWrap: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  capitalize: {
    textTransform: 'capitalize',
  },
  editButton: {
    marginTop: 8,
  },
  cancelButton: {
    marginTop: 12,
  },
  fieldError: {
    fontSize: 13,
    marginTop: -8,
    marginBottom: 12,
  },
});
