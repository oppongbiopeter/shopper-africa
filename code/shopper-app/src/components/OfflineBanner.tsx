import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { flushQueue, getPendingOrderCount } from '../services/offline';

export default function OfflineBanner() {
  const status = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [syncing, setSyncing] = useState(false);
  useEffect(() => {
    const refresh = async () => setPendingCount(await getPendingOrderCount());
    refresh();
    const interval = setInterval(refresh, 4000);
    return () => clearInterval(interval);
  }, [status]);
  const handleForceSync = async () => {
    setSyncing(true);
    try { await flushQueue(); setPendingCount(await getPendingOrderCount()); }
    finally { setSyncing(false); }
  };
  if (status === 'online' && pendingCount === 0) return null;
  const isOffline = status === 'offline' || status === 'unknown';
  return (
    <View style={[styles.banner, isOffline ? styles.offline : styles.syncing]}>
      <View style={styles.textCol}>
        <Text style={styles.title}>{isOffline ? 'No internet connection' : 'Syncing your orders…'}</Text>
        <Text style={styles.subtitle}>
          {isOffline
            ? pendingCount > 0
              ? `${pendingCount} order(s) saved on this phone. Will sync automatically when you reconnect.`
              : 'You can still browse and place orders. They will be sent when you are back online.'
            : `${pendingCount} order(s) waiting to reach the server.`}
        </Text>
      </View>
      {!isOffline && pendingCount > 0 && (
        <TouchableOpacity style={styles.btn} onPress={handleForceSync} disabled={syncing}>
          <Text style={styles.btnText}>{syncing ? '…' : 'Sync now'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  banner: { paddingHorizontal: 14, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  offline: { backgroundColor: '#B71C1C' },
  syncing: { backgroundColor: '#E65100' },
  textCol: { flex: 1, paddingRight: 10 },
  title: { color: '#fff', fontWeight: '700', fontSize: 14 },
  subtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 12, marginTop: 2, lineHeight: 16 },
  btn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '600', fontSize: 13 },
});
