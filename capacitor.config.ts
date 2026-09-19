import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lokmanyamandal.app',
  appName: 'Lokmanya Mandal',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
