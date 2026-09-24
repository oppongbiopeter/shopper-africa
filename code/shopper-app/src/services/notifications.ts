import { collection, addDoc, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../firebase';

export type NotificationType =
  | 'shopper_assigned' | 'shopping_started' | 'substitution_proposed' | 'substitution_resolved'
  | 'shopping_complete' | 'rider_assigned' | 'out_for_delivery' | 'nearby' | 'delivered'
  | 'rating_request' | 'earnings' | 'system';

export type AppNotification = {
  id?: string; userId: string; type: NotificationType; title: string; body: string;
  orderId?: string; read: boolean; createdAt?: any; data?: Record<string, any>;
};

export async function sendNotification(partial: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) {
  await addDoc(collection(db, 'notifications', partial.userId, 'items'), {
    ...partial, read: false, createdAt: serverTimestamp(),
  });
}
export function listenNotifications(userId: string, cb: (list: AppNotification[]) => void) {
  const q = query(collection(db, 'notifications', userId, 'items'), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AppNotification))), () => cb([]));
}
export async function markRead(userId: string, notificationId: string) {
  await updateDoc(doc(db, 'notifications', userId, 'items', notificationId), { read: true });
}
export async function markAllRead(userId: string, ids: string[]) {
  await Promise.all(ids.map((id) => markRead(userId, id)));
}
export async function notifyShopperAssigned(customerId: string, orderId: string, shopperName: string) {
  return sendNotification({ userId: customerId, type: 'shopper_assigned', title: 'Shopper assigned',
    body: `${shopperName} is picking your order ${orderId}`, orderId });
}
export async function notifySubstitution(customerId: string, orderId: string, itemName: string) {
  return sendNotification({ userId: customerId, type: 'substitution_proposed', title: 'Substitution proposed',
    body: `Your shopper suggested a substitute for “${itemName}”. Open the order to Accept or Reject.`, orderId });
}
export async function notifyOutForDelivery(customerId: string, orderId: string, vehicle: string) {
  return sendNotification({ userId: customerId, type: 'out_for_delivery', title: 'Out for delivery',
    body: `Your order ${orderId} is on the way (${vehicle}).`, orderId });
}
export async function notifyDelivered(customerId: string, orderId: string) {
  return sendNotification({ userId: customerId, type: 'delivered', title: 'Delivered',
    body: `Order ${orderId} has been delivered. Please rate your experience.`, orderId });
}
export async function notifyRatingRequest(customerId: string, orderId: string) {
  return sendNotification({ userId: customerId, type: 'rating_request', title: 'Rate your order',
    body: `How was the shopper and delivery for ${orderId}?`, orderId });
}
