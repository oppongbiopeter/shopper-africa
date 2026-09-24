import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

type Props = { orderId: string; momoRef: string; amount: number; onPaid: () => void };

export default function MoMoPayButton({ orderId, momoRef, amount, onPaid }: Props) {
  const [status, setStatus] = useState<'pending_payment' | 'paid' | 'failed'>('pending_payment');
  const [countdown, setCountdown] = useState(300);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'orders', orderId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.status === 'paid') { setStatus('paid'); Alert.alert('Payment Confirmed', `Order ${orderId} paid via Ref ${momoRef}`); onPaid(); }
        if (data.status === 'failed') setStatus('failed');
      }
    });
    return () => unsub();
  }, [orderId]);
  useEffect(() => {
    const timer = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(timer);
  }, []);
  if (status === 'paid') {
    return (<View style={styles.paidBox}><Text style={styles.paidText}> Paid — Ref {momoRef}</Text><Text>Order {orderId} confirmed</Text></View>);
  }
  return (
    <View style={styles.container}>
      <View style={styles.refBox}>
        <Text style={styles.refLabel}>Your MoMo Ref for this order:</Text>
        <Text style={styles.ref}>{momoRef}</Text>
        <Text style={styles.refSub}>Order: {orderId}</Text>
      </View>
      <View style={styles.instructions}>
        <Text style={styles.stepTitle}>How to pay:</Text>
        <Text>1. Dial *170#</Text><Text>2. Choose 1 - MoMo Transfer</Text>
        <Text>3. Choose 6 - Pay Bill / Merchant</Text><Text>4. Enter Merchant ID: SHOPPER</Text>
        <Text style={styles.bold}>5. Enter Reference: {momoRef}</Text>
        <Text>6. Enter Amount: GHS {amount}</Text><Text>7. Enter PIN to confirm</Text>
      </View>
      <View style={styles.statusRow}>
        <ActivityIndicator size="small" color="#FFCC00" />
        <Text style={styles.waiting}> Waiting for payment... {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { marginTop: 16 },
  refBox: { backgroundColor: '#000', padding: 20, borderRadius: 12, alignItems: 'center', marginBottom: 16 },
  refLabel: { color: '#FFCC00', fontSize: 12, marginBottom: 4 },
  ref: { color: '#fff', fontSize: 48, fontWeight: '900', letterSpacing: 8 },
  refSub: { color: '#aaa', fontSize: 12, marginTop: 4 },
  instructions: { backgroundColor: '#fff', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#eee' },
  stepTitle: { fontWeight: 'bold', marginBottom: 8 },
  bold: { fontWeight: 'bold', backgroundColor: '#FFF8E1', padding: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginTop: 16, justifyContent: 'center' },
  waiting: { marginLeft: 8, color: '#666' },
  paidBox: { backgroundColor: '#E8F5E9', padding: 20, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: '#4CAF50' },
  paidText: { fontSize: 18, fontWeight: 'bold', color: '#2E7D32' },
});
