import React, {useCallback, useEffect, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';

import {useTheme} from '../theme/ThemeContext';

type ToastType = 'info' | 'success' | 'error';

type ToastPayload = {
  message: string;
  type?: ToastType;
  duration?: number;
};

type ToastState = ToastPayload & {visible: boolean};

let showToastCallback: ((payload: ToastPayload) => void) | null = null;

export function showToast(payload: ToastPayload) {
  showToastCallback?.(payload);
}

export function ToastProvider({children}: {children: React.ReactNode}) {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'info',
    duration: 2500,
  });

  const hideToast = useCallback(() => {
    setToast(prev => ({...prev, visible: false}));
  }, []);

  const displayToast = useCallback((payload: ToastPayload) => {
    setToast({
      visible: true,
      message: payload.message,
      type: payload.type ?? 'info',
      duration: payload.duration ?? 2500,
    });
  }, []);

  useEffect(() => {
    showToastCallback = displayToast;
    return () => {
      if (showToastCallback === displayToast) {
        showToastCallback = null;
      }
    };
  }, [displayToast]);

  return (
    <>
      {children}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type ?? 'info'}
        duration={toast.duration ?? 2500}
        onHide={hideToast}
      />
    </>
  );
}

type ToastProps = {
  visible: boolean;
  message: string;
  type: ToastType;
  duration: number;
  onHide: () => void;
};

function Toast({visible, message, type, duration, onHide}: ToastProps) {
  const {colors} = useTheme();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const translateY = React.useRef(new Animated.Value(24)).current;

  const backgroundColor =
    type === 'success'
      ? colors.success
      : type === 'error'
        ? colors.error
        : colors.primary;

  useEffect(() => {
    if (!visible) return;

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 24,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(({finished}) => {
        if (finished) onHide();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [visible, duration, message, onHide, opacity, translateY]);

  if (!visible) return null;

  return (
    <View style={styles.host} pointerEvents="none">
      <Animated.View
        style={[
          styles.toast,
          {backgroundColor, opacity, transform: [{translateY}]},
        ]}>
        <Text style={styles.message}>{message}</Text>
      </Animated.View>
    </View>
  );
}

export default Toast;

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 32,
    zIndex: 999,
  },
  toast: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
});
