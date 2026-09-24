import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { seedDemoData } from './seed';
import { assignShopper } from './shopperService';
import { assignDeliveryAgent } from './assignment';
import { simulateDroneFlight } from './droneTelemetry';

export async function runFullDemo(opts?: { userId?: string; skipToDelivery?: boolean }) {
  const userId = opts?.userId || 'demo-user';
  await seedDemoData();
  const last4 = Date.now().toString().slice(-4);
  const orderId = `ORD-${last4}`;
  const momoRef = last4;
  const items = [
    { id: 'p-rice-5kg', name: 'Royal Aroma Rice 5kg', qty: 1, price: 85, status: 'pending' },
    { id: 'p-oil-1l', name: 'Frytol Vegetable Oil 1L', qty: 1, price: 32, status: 'pending' },
    { id: 'p-eggs', name: 'Fresh Eggs (crate)', qty: 1, price: 45, status: 'pending' },
  ];
  await setDoc(doc(db, 'orders', orderId), {
    orderId, momoRef, paymentIntentId: `pi_${momoRef}_16200`, userId,
    storeId: 'store-melcom-osu', storeLat: 5.56, storeLng: -0.175,
    customerLat: 5.58, customerLng: -0.185, preferDrone: true, items,
    amount: 16200, currency: 'GHS', status: 'paid',
    paidAt: serverTimestamp(), createdAt: serverTimestamp(),
  });
  const shopper = await assignShopper(orderId, 'store-melcom-osu');
  let deliveryInfo: any = null;
  if (opts?.skipToDelivery) {
    await setDoc(doc(db, 'orders', orderId), { status: 'shopping_complete', shoppingCompletedAt: serverTimestamp() }, { merge: true });
    const job = await assignDeliveryAgent({
      orderId, storeLat: 5.56, storeLng: -0.175, customerLat: 5.58, customerLng: -0.185,
      itemCount: items.length, totalWeightKg: 7, preferDrone: true,
    });
    if (job?.vehicleType === 'drone' && job.agentId) {
      simulateDroneFlight({
        droneId: job.agentId, orderId,
        from: { lat: 5.56, lng: -0.175 }, to: { lat: 5.58, lng: -0.185 }, steps: 10,
      }).catch(console.warn);
    }
    deliveryInfo = job;
  }
  return {
    orderId, momoRef, shopperId: shopper?.id || null, shopperName: shopper?.name || null,
    assignedVehicle: deliveryInfo?.vehicleType || null, agentId: deliveryInfo?.agentId || null,
  };
}
