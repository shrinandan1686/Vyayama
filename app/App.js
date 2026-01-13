import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppNavigator from './navigation/AppNavigator';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ErrorBoundary>
  );
}
