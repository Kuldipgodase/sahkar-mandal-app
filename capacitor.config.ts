import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sahakarmandal.app',
  appName: 'Sahakar Mandal',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true,
    backgroundColor: '#8B0000',
    captureInput: true
  }
};

export default config;
