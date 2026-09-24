import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const LINKS = [
  { title: 'Orders', screen: 'AdminOrders', desc: 'Live orders & status' },
  { title: 'Disputes', screen: 'AdminDisputes', desc: 'Open & resolve disputes' },
  { title: 'Pricing & Earnings', screen: 'AdminPricing', desc: 'Edit all fee & pay parameters' },
  { title: 'Store Onboarding', screen: 'AdminStores', desc: 'Approve stores' },
  { title: 'Products / Barcode', screen: 'AdminProducts', desc: 'Single, batch CSV, barcode' },
  { title: 'Drone Fleet & Ghana UTM', screen: 'AdminFleet', desc: 'Nests, aircraft, missions' },
  { title: 'Growth', screen: 'AdminGrowth', desc: 'Promos, referrals, abandoned' },
  { title: 'Offline Sync', screen: 'AdminSync', desc: 'Queue, dead-letter, flush metrics' },
  { title: 'Fulfillment & coverage', screen: 'AdminFulfillment', desc: 'Vehicles, drone toggle, ops areas' },
];

export default function AdminHome({ navigation }: any) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.title}>Admin Dashboard</Text>
      <Text style={styles.sub}>Shopper Ghana · full control</Text>
      {LINKS.map((l) => (
        <TouchableOpacity key={l.screen} style={styles.card} onPress={() => navigation.navigate(l.screen)}>
          <Text style={styles.cardTitle}>{l.title}</Text>
          <Text style={styles.cardDesc}>{l.desc}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  title: { fontSize: 24, fontWeight: '900' },
  sub: { color: '#666', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  cardTitle: { fontWeight: '700', fontSize: 16 },
  cardDesc: { fontSize: 13, color: '#666', marginTop: 4 },
});
