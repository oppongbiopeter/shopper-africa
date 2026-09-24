/**
 * React Native entry point for Shopper Ghana
 * Registers Android foreground service for live GPS during deliveries.
 */
import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

try {
  const ReactNativeForegroundService = require('@supersami/rn-foreground-service').default
    || require('@supersami/rn-foreground-service');
  if (ReactNativeForegroundService?.register) {
    ReactNativeForegroundService.register();
  }
} catch (e) {
  console.warn('[Shopper] Foreground service package not available:', e?.message || e);
}

AppRegistry.registerComponent(appName, () => App);
