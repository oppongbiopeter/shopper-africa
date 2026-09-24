import { collection, addDoc, query, where, orderBy, getDocs, onSnapshot, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { sendNotification } from './notifications';

export type EarningRecord = {
  id?: string; userId: string; role: 'shopper' | 'rider'; orderId: string;
  baseFee: number; itemFee: number; tip: number; batchBonus: number; total: number; currency: 'GHS'; createdAt?: any;
};
const SHOPPER_BASE = 8, SHOPPER_PER_ITEM = 1.5, RIDER_BASE = 6, BATCH_BONUS = 5;

export function calcShopperEarning(itemCount: number, tip = 0, isBatch = false) {
  const baseFee = SHOPPER_BASE, itemFee = itemCount * SHOPPER_PER_ITEM, batchBonus = isBatch ? BATCH_BONUS : 0;
  return { baseFee, itemFee, tip, batchBonus, total: baseFee + itemFee + tip + batchBonus, currency: 'GHS' as const };
}
export function calcRiderEarning(tip = 0, isBatch = false) {
  const baseFee = RIDER_BASE, batchBonus = isBatch ? BATCH_BONUS : 0;
  return { baseFee, itemFee: 0, tip, batchBonus, total: baseFee + tip + batchBonus, currency: 'GHS' as const };
}
export async function recordEarning(partial: Omit<EarningRecord, 'id' | 'createdAt'>) {
  await addDoc(collection(db, 'earnings'), { ...partial, createdAt: serverTimestamp() });
  await sendNotification({ userId: partial.userId, type: 'earnings', title: 'Earnings added',
    body: `+GHS ${partial.total.toFixed(2)} for order ${partial.orderId}`, orderId: partial.orderId, data: { total: partial.total } });
}
export async function getEarnings(userId: string, role?: 'shopper' | 'rider') {
  const q = query(collection(db, 'earnings'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(100));
  const snap = await getDocs(q);
  let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as EarningRecord));
  if (role) list = list.filter((e) => e.role === role);
  return list;
}
export function listenEarnings(userId: string, cb: (list: EarningRecord[]) => void) {
  const q = query(collection(db, 'earnings'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
  return onSnapshot(q, (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as EarningRecord))), () => cb([]));
}
export function sumEarnings(list: EarningRecord[]) { return list.reduce((s, e) => s + (e.total || 0), 0); }
