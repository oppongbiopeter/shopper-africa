import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { submitRating } from '../../services/ratings';

function Stars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map((n) => (
        <TouchableOpacity key={n} onPress={() => onChange(n)}>
          <Text style={[styles.star, n <= value && styles.starOn]}>★</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function RateOrder({ route, navigation }: any) {
  const { orderId, userId = 'demo-user' } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [shopperStars, setShopperStars] = useState(5);
  const [riderStars, setRiderStars] = useState(5);
  const [shopperComment, setShopperComment] = useState('');
  const [riderComment, setRiderComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  useEffect(() => {
    getDoc(doc(db, 'orders', orderId)).then((snap) => { if (snap.exists()) setOrder(snap.data()); });
  }, [orderId]);
  const submit = async () => {
    setSubmitting(true);
    try {
      await submitRating({
        orderId, customerId: userId, shopperId: order?.shopperId, shopperStars,
        shopperComment: shopperComment.trim() || undefined, riderId: order?.delivery?.agentId,
        riderStars, riderComment: riderComment.trim() || undefined,
        overallStars: Math.round((shopperStars + riderStars) / 2),
      });
      Alert.alert('Thanks!', 'Your rating has been submitted.');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Could not submit rating');
    }
    setSubmitting(false);
  };
  if (!order) return <View style={styles.center}><Text>Loading…</Text></View>;
  if (order.rated) return <View style={styles.center}><Text style={styles.done}>You already rated this order. Thank you!</Text></View>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate order {orderId}</Text>
      <Text style={styles.label}>Shopper {order.shopperName || ''}</Text>
      <Stars value={shopperStars} onChange={setShopperStars} />
      <TextInput style={styles.input} placeholder="Shopper comment" value={shopperComment} onChangeText={setShopperComment} />
      <Text style={styles.label}>Delivery</Text>
      <Stars value={riderStars} onChange={setRiderStars} />
      <TextInput style={styles.input} placeholder="Rider comment" value={riderComment} onChangeText={setRiderComment} />
      <TouchableOpacity style={styles.btn} onPress={submit} disabled={submitting}>
        <Text style={styles.btnText}>{submitting ? 'Submitting…' : 'Submit rating'}</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '800', marginBottom: 16 },
  label: { fontWeight: '700', marginTop: 12 },
  stars: { flexDirection: 'row', marginVertical: 8 },
  star: { fontSize: 28, color: '#ddd', marginRight: 6 },
  starOn: { color: '#FFCC00' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginTop: 6 },
  btn: { backgroundColor: '#FFCC00', padding: 14, borderRadius: 10, alignItems: 'center', marginTop: 20 },
  btnText: { fontWeight: '800' }, done: { fontWeight: '700' },
});
