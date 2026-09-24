import { Platform } from 'react-native';
const CHANNEL_ID = 'shopper_location';
const NOTIF_ID = 42001;
function getFgService(): any | null {
  if (Platform.OS !== 'android') return null;
  try { return require('@supersami/rn-foreground-service').default; }
  catch {
    try { return require('@supersami/rn-foreground-service'); }
    catch { return null; }
  }
}
let running = false;
export async function startForegroundLocationService(opts?: { title?: string; body?: string }): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  const FG = getFgService();
  if (!FG) return false;
  try {
    if (!running) {
      await FG.createNotificationChannel({
        id: CHANNEL_ID, name: 'Live delivery tracking',
        description: 'Shows while sharing your location on an active job', importance: 3, enableVibration: false,
      });
    }
    await FG.start({
      id: NOTIF_ID, title: opts?.title || 'Shopper — location sharing',
      message: opts?.body || 'Customers can track your delivery in real time',
      ServiceType: 'location', icon: 'ic_launcher', button: false, button2: false,
      color: '#FFCC00', visibility: 'public', ongoing: true,
    });
    running = true; return true;
  } catch { return false; }
}
export async function stopForegroundLocationService(): Promise<void> {
  if (Platform.OS !== 'android') return;
  const FG = getFgService();
  if (!FG || !running) { running = false; return; }
  try { if (typeof FG.stop === 'function') await FG.stop(); } catch {}
  running = false;
}
export function isForegroundLocationRunning() { return running; }
