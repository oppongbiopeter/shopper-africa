import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Linking, Alert } from 'react-native';
import { initializePaystackTransaction, verifyPaystackTransaction } from '../services/paystack';
import type { PaymentMethodId } from '../services/paymentMethods';
import { showErrorAlert, retryAsync } from '../services/errors';

type Props = {
  orderId: string; amountPesewas: number; email?: string; method: PaymentMethodId;
  onSuccess: (reference: string) => void; onCancel?: () => void;
};

export default function PaystackCheckout({ orderId, amountPesewas, email = 'customer@shopper.app', method, onSuccess, onCancel }: Props) {
  const [loading, setLoading] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const start = async () => {
    setLoading(true);
    try {
      const result = await initializePaystackTransaction({ orderId, amountPesewas, email, method });
      if (!result.success || !result.authorizationUrl) {
        Alert.alert('Payment', result.message || 'Could not start Paystack'); setLoading(false); return;
      }
      setReference(result.reference);
      const supported = await Linking.canOpenURL(result.authorizationUrl);
      if (supported) await Linking.openURL(result.authorizationUrl);
      else Alert.alert('Open this URL', result.authorizationUrl);
    } catch (e: any) {
      showErrorAlert('Paystack.start', e, { onRetry: () => start(), title: 'Paystack' });
    }
    setLoading(false);
  };
  const confirmPaid = async () => {
    if (!reference) { Alert.alert('Start payment first'); return; }
    setLoading(true);
    try {
      const verified = await retryAsync(() => verifyPaystackTransaction(reference), { retries: 2, context: 'Paystack.verify' });
      setLoading(false);
      if (verified.success) onSuccess(reference);
      else showErrorAlert('Paystack.verify', new Error(verified.message || 'Not verified'), { onRetry: () => confirmPaid(), title: 'Payment not verified' });
    } catch (e) {
      setLoading(false);
      showErrorAlert('Paystack.verify', e, { onRetry: () => confirmPaid() });
    }
  };
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Paystack</Text>
      <Text style={styles.sub}>Visa, Mastercard & mobile money via Paystack (GHS)</Text>
      {loading && <ActivityIndicator color="#0BA4DB" style={{ marginVertical: 8 }} />}
      <TouchableOpacity style={styles.btn} onPress={start} disabled={loading}>
        <Text style={styles.btnText}>{reference ? 'Re-open Paystack' : 'Pay with Paystack'}</Text>
      </TouchableOpacity>
      {reference && (
        <TouchableOpacity style={styles.btnSecondary} onPress={confirmPaid} disabled={loading}>
          <Text style={styles.btnText}>I have paid — verify</Text>
        </TouchableOpacity>
      )}
      {onCancel && <TouchableOpacity onPress={onCancel}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>}
    </View>
  );
}
const styles = StyleSheet.create({
  box: { backgroundColor: '#E8F7FC', borderRadius: 12, padding: 14, marginTop: 8, borderWidth: 1, borderColor: '#0BA4DB44' },
  title: { fontWeight: '800', fontSize: 15, color: '#0A2540' },
  sub: { fontSize: 12, color: '#555', marginTop: 4, marginBottom: 8 },
  btn: { backgroundColor: '#0BA4DB', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  btnSecondary: { backgroundColor: '#0A2540', padding: 14, borderRadius: 10, alignItems: 'center', marginBottom: 8 },
  btnText: { color: '#fff', fontWeight: '700' }, cancel: { textAlign: 'center', color: '#666', marginTop: 4 },
});
