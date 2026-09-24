import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { listenDisputes, resolveDispute, Dispute } from '../../services/disputes';

export default function AdminDisputes() {
  const [list, setList] = useState<Dispute[]>([]);
  const [resolution, setResolution] = useState('');
  const [activeId, setActiveId] = useState<string | null>(null);
  useEffect(() => listenDisputes(setList), []);
  const resolve = async (id: string, status: 'resolved' | 'rejected') => {
    if (!resolution.trim()) { Alert.alert('Enter resolution note'); return; }
    await resolveDispute(id, resolution.trim(), status, 'admin');
    setActiveId(null); setResolution(''); Alert.alert('Updated');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Disputes</Text>
      <FlatList data={list} keyExtractor={(i) => i.id || i.orderId} contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No disputes</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.id}>{item.orderId}</Text>
            <Text style={styles.meta}>{item.status} · {item.openedByRole} · {item.reason}</Text>
            {item.details ? <Text style={styles.details}>{item.details}</Text> : null}
            {item.status === 'open' || item.status === 'investigating' ? (
              <View style={styles.actions}>
                <TextInput style={styles.input} placeholder="Resolution note" value={activeId === item.id ? resolution : ''}
                  onFocus={() => setActiveId(item.id || null)} onChangeText={setResolution} />
                <View style={styles.row}>
                  <TouchableOpacity style={styles.resolveBtn} onPress={() => item.id && resolve(item.id, 'resolved')}>
                    <Text style={styles.btnText}>Resolve</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.rejectBtn} onPress={() => item.id && resolve(item.id, 'rejected')}>
                    <Text style={styles.btnText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : <Text style={styles.resolution}>{item.resolution}</Text>}
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
  id: { fontWeight: '700' }, meta: { fontSize: 12, color: '#666', marginTop: 2 }, details: { fontSize: 13, marginTop: 6 },
  actions: { marginTop: 10 }, input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 8, marginBottom: 8 },
  row: { flexDirection: 'row', gap: 8 },
  resolveBtn: { flex: 1, backgroundColor: '#2E7D32', padding: 10, borderRadius: 8, alignItems: 'center' },
  rejectBtn: { flex: 1, backgroundColor: '#C62828', padding: 10, borderRadius: 8, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' }, resolution: { marginTop: 6, fontSize: 12, color: '#2E7D32' },
});
