import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { collection, query, orderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../../firebase';

export default function AdminOrders({ navigation }: any) {
  const [orders, setOrders] = useState<any[]>([]);
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'), limit(80));
    return onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, () => setOrders([]));
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders ({orders.length})</Text>
      <FlatList data={orders} keyExtractor={(i) => i.orderId || i.id} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, item.hasDispute && styles.dispute]}
            onPress={() => navigation.navigate('OrderDetail', { orderId: item.orderId || item.id, userId: item.userId })}>
            <Text style={styles.id}>{item.orderId || item.id}</Text>
            <Text style={styles.meta}>{item.status} · GHS {((item.amount || 0) / 100).toFixed(2)}{item.tipGhs ? ` · tip ${item.tipGhs}` : ''}</Text>
            <Text style={styles.meta}>{item.shopperName || 'no shopper'} · {item.delivery?.vehicleType || 'no rider'}</Text>
            {item.hasDispute && <Text style={styles.flag}>DISPUTE</Text>}
          </TouchableOpacity>
        )} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  title: { fontSize: 20, fontWeight: '800', padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#eee' },
  dispute: { borderColor: '#C62828', backgroundColor: '#FFEBEE' },
  id: { fontWeight: '700' },
  meta: { fontSize: 12, color: '#666', marginTop: 2 },
  flag: { marginTop: 4, color: '#C62828', fontWeight: '800', fontSize: 11 },
});
