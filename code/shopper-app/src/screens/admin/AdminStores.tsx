import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { approveStore, rejectStore, StoreApplication } from '../../services/adminStore';

export default function AdminStores() {
  const [apps, setApps] = useState<(StoreApplication & { id: string })[]>([]);
  useEffect(() => {
    const q = query(collection(db, 'storeApplications'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, (snap) => {
      setApps(snap.docs.map((d) => ({ id: d.id, ...d.data() } as any)));
    }, () => setApps([]));
  }, []);
  const approve = async (app: StoreApplication & { id: string }) => {
    const storeId = await approveStore(app.id, app);
    Alert.alert('Approved', `Store created: ${storeId}`);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Onboarding</Text>
      <FlatList data={apps} keyExtractor={(i) => i.id} contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No applications</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.businessName}</Text>
            <Text style={styles.meta}>{item.area}, {item.city} · {item.type} · {item.status}</Text>
            <Text style={styles.meta}>{item.contactName} · {item.contactPhone}</Text>
            {item.status === 'pending' && (
              <View style={styles.row}>
                <TouchableOpacity style={styles.approve} onPress={() => approve(item)}>
                  <Text style={styles.btnText}>Approve</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reject} onPress={() => rejectStore(item.id, 'Does not meet criteria')}>
                  <Text style={styles.btnText}>Reject</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  title: { fontSize: 20, fontWeight: '800', padding: 16 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  name: { fontWeight: '700', fontSize: 16 },
  meta: { fontSize: 12, color: '#666', marginTop: 2 },
  row: { flexDirection: 'row', gap: 8, marginTop: 10 },
  approve: { flex: 1, backgroundColor: '#2E7D32', padding: 10, borderRadius: 8, alignItems: 'center' },
  reject: { flex: 1, backgroundColor: '#C62828', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
