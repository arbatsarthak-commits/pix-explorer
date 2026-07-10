import React from 'react';
import {Provider as ReduxProvider} from 'react-redux';

import {ToastProvider} from './components/Toast';
import AppNavigator from './navigation/AppNavigator';
import {store} from './redux/store';
import {ThemeProvider} from './theme/ThemeContext';

export type {RootStackParamList} from './navigation/types';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <ToastProvider>
          <AppNavigator />
        </ToastProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
