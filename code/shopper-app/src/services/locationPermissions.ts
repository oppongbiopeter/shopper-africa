import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';
export type PermissionResult = 'granted' | 'denied' | 'blocked' | 'unavailable';
function getGeo() {
  try { return require('react-native-geolocation-service').default; } catch { return null; }
}
export async function requestLocationPermission(opts?: { background?: boolean }): Promise<PermissionResult> {
  const background = opts?.background ?? false;
  if (Platform.OS === 'android') {
    try {
      const fine = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: 'Location permission',
        message: 'Shopper needs your location for live delivery tracking and nearby order batches.',
        buttonPositive: 'Allow', buttonNegative: 'Deny',
      });
      if (fine !== PermissionsAndroid.RESULTS.GRANTED) {
        return fine === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN ? 'blocked' : 'denied';
      }
      if (background && Platform.Version >= 29) {
        await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION, {
          title: 'Background location',
          message: 'Allow location in the background so customers can track you while the app is minimized during a delivery.',
          buttonPositive: 'Allow all the time', buttonNegative: 'Deny',
        });
      }
      return 'granted';
    } catch { return 'unavailable'; }
  }
  const Geo = getGeo();
  if (!Geo) return 'unavailable';
  try {
    const status = background ? await Geo.requestAuthorization('always') : await Geo.requestAuthorization('whenInUse');
    if (status === 'granted' || status === 'authorizedAlways' || status === 'authorizedWhenInUse') return 'granted';
    if (status === 'denied') return 'denied';
    if (status === 'disabled' || status === 'restricted') return 'blocked';
    return 'denied';
  } catch { return 'unavailable'; }
}
export function promptOpenSettings() {
  Alert.alert('Location required', 'Enable location in Settings so customers can track deliveries and you can see nearby batches.', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Open Settings', onPress: () => Linking.openSettings() },
  ]);
}
