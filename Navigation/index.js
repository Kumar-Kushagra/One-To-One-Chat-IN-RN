import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './AuthProvider';
import Routes from './Routes';

const Providers = () => {
  return (
    <PaperProvider>
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </PaperProvider>
  );
}
export default Providers;