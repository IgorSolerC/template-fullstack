import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.templatefullstack.app',
  appName: 'frontend',
  webDir: 'dist/frontend/browser',
  server: {
    androidScheme: 'http',
    cleartext: true
  }
};

export default config;
