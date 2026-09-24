import { doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { getPricingConfig } from './pricingConfig';
import { recordEarning } from './earnings';
import { sendNotification } from './notifications';

export async function setOrderTip(orderId: string, tipGhs: number, phase: 'checkout' | 'after_delivery') {
  const orderRef = doc(db, 'orders', orderId);
  const snap = await getDoc(orderRef);
  if (!snap.exists()) throw new Error('Order not found');
  const order = snap.data();
  const config = await getPricingConfig();
  if (phase === 'after_delivery') {
    if (!config.allowTipAfterDelivery) throw new Error('Tip after delivery is disabled');
    if (order.status !== 'delivered') throw new Error('Order not delivered yet');
    const deliveredAt = order.deliveredAt?.toMillis?.() || order.deliveredAt || Date.now();
    const hours = (Date.now() - deliveredAt) / (1000 * 60 * 60);
    if (hours > config.tipEditWindowHours) throw new Error(`Tip window closed (${config.tipEditWindowHours}h after delivery)`);
  }
  const previousTip = order.tipGhs || 0;
  const newTip = Math.max(0, tipGhs);
  await updateDoc(orderRef, { tipGhs: newTip, tipPhase: phase, tipUpdatedAt: serverTimestamp() });
  const delta = newTip - previousTip;
  if (delta > 0) {
    const shopperId = order.shopperId;
    const riderId = order.delivery?.agentId;
    if (shopperId && riderId) {
      const shopperShare = Math.round(delta * 0.7 * 100) / 100;
      const riderShare = Math.round((delta - shopperShare) * 100) / 100;
      await recordEarning({ userId: shopperId, role: 'shopper', orderId, baseFee: 0, itemFee: 0, tip: shopperShare, batchBonus: 0, total: shopperShare, currency: 'GHS' });
      await recordEarning({ userId: riderId, role: 'rider', orderId, baseFee: 0, itemFee: 0, tip: riderShare, batchBonus: 0, total: riderShare, currency: 'GHS' });
    } else if (shopperId) {
      await recordEarning({ userId: shopperId, role: 'shopper', orderId, baseFee: 0, itemFee: 0, tip: delta, batchBonus: 0, total: delta, currency: 'GHS' });
    } else if (riderId) {
      await recordEarning({ userId: riderId, role: 'rider', orderId, baseFee: 0, itemFee: 0, tip: delta, batchBonus: 0, total: delta, currency: 'GHS' });
    }
    if (shopperId) {
      await sendNotification({ userId: shopperId, type: 'earnings',
        title: phase === 'after_delivery' ? 'Tip increased!' : 'Tip received',
        body: `+GHS ${delta.toFixed(2)} tip on ${orderId}`, orderId });
    }
  }
  return { previousTip, newTip, delta };
}
