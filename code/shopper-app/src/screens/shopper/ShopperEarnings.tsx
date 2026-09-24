import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { listenEarnings, sumEarnings, EarningRecord } from '../../services/earnings';

export default function ShopperEarnings({ route }: any) {
  const shopperId = route?.params?.shopperId || 'shopper-01';
  const [list, setList] = useState<EarningRecord[]>([]);
  useEffect(() => listenEarnings(shopperId, setList), [shopperId]);
  const total = sumEarnings(list.filter((e) => e.role === 'shopper'));
  return (
    <View style={styles.container}>
      <View style={styles.summary}>
        <Text style={styles.summaryLabel}>Total earnings</Text>
        <Text style={styles.summaryValue}>GHS {total.toFixed(2)}</Text>
      </View>
      <Text style={styles.section}>History</Text>
      <FlatList data={list.filter((e) => e.role === 'shopper')} keyExtractor={(i) => i.id || i.orderId}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No earnings yet. Complete a shopping job!</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.orderId}>{item.orderId}</Text>
            <Text style={styles.breakdown}>
              Base GHS {item.baseFee.toFixed(2)}
              {item.itemFee > 0 ? ` · Items GHS ${item.itemFee.toFixed(2)}` : ''}
              {item.tip > 0 ? ` · Tip GHS ${item.tip.toFixed(2)}` : ''}
              {item.batchBonus > 0 ? ` · Batch +GHS ${item.batchBonus.toFixed(2)}` : ''}
            </Text>
            <Text style={styles.total}>+ GHS {item.total.toFixed(2)}</Text>
          </View>
        )} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  summary: { backgroundColor: '#FFCC00', padding: 24, alignItems: 'center' },
  summaryLabel: { fontSize: 13, fontWeight: '600' },
  summaryValue: { fontSize: 32, fontWeight: '900', marginTop: 4 },
  section: { padding: 16, fontWeight: '700' },
  empty: { textAlign: 'center', marginTop: 30, color: '#999' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  orderId: { fontWeight: '700' },
  breakdown: { fontSize: 12, color: '#666', marginTop: 4 },
  total: { fontWeight: '700', marginTop: 6, color: '#2E7D32' },
});
