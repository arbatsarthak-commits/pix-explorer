import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useDispatch, useSelector} from 'react-redux';

import {store} from '../redux/store';
import {setAuthFromStorage} from '../redux/slices/authSlice';
import {setFavorites} from '../redux/slices/favoritesSlice';
import {setProfile} from '../redux/slices/profileSlice';
import {loadAuthSession} from '../services/authStorage';
import {loadFavorites} from '../services/favoritesStorage';
import {loadUserProfile} from '../services/profileStorage';
import {useTheme} from '../theme/ThemeContext';
import RegisterScreen from '../screens/Register/RegisterScreen';
import LoginScreen from '../screens/Login/LoginScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import FavoritesScreen from '../screens/Favorites/FavoritesScreen';
import ImageDetailsScreen from '../screens/ImageDetails/ImageDetailsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import type {AppDispatch, RootState} from '../redux/store';
import type {RootStackParamList} from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Favorites" component={FavoritesScreen} />
      <Stack.Screen name="ImageDetails" component={ImageDetailsScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

function GuestStack() {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animation: 'slide_from_right'}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function RootNavigator() {
  const isAuthenticated = useSelector((s: RootState) => s.auth.isAuthenticated);
  const userId = useSelector((s: RootState) => s.auth.userId);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!isAuthenticated || !userId) return;
    loadFavorites(userId)
      .then(data => dispatch(setFavorites(data)))
      .catch(() => {});
  }, [dispatch, isAuthenticated, userId]);

  return isAuthenticated ? <AuthenticatedStack /> : <GuestStack />;
}

export default function AppNavigator() {
  const {navigationTheme, colors} = useTheme();
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const session = await loadAuthSession();
        if (session) {
          store.dispatch(setAuthFromStorage(session));
          const profile = await loadUserProfile(session.userId);
          if (profile) store.dispatch(setProfile(profile));
          const favorites = await loadFavorites(session.userId);
          store.dispatch(setFavorites(favorites));
        }
      } finally {
        setBootstrapped(true);
      }
    })();
  }, []);

  if (!bootstrapped) {
    return (
      <View style={[styles.boot, {backgroundColor: colors.background}]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  boot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
