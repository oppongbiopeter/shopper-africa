import {
  collection, addDoc, updateDoc, doc, query, orderBy, onSnapshot, serverTimestamp, limit,
} from 'firebase/firestore';
import { db } from '../firebase';

export type DisputeStatus = 'open' | 'investigating' | 'resolved' | 'rejected';
export type Dispute = {
  id?: string;
  orderId: string;
  openedBy: string;
  openedByRole: 'customer' | 'shopper' | 'rider' | 'merchant';
  reason: string;
  details?: string;
  status: DisputeStatus;
  resolution?: string;
  createdAt?: any;
  resolvedAt?: any;
  resolvedBy?: string;
};

export async function openDispute(d: Omit<Dispute, 'id' | 'status' | 'createdAt'>) {
  const ref = await addDoc(collection(db, 'disputes'), {
    ...d, status: 'open', createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'orders', d.orderId), { hasDispute: true, disputeId: ref.id });
  return ref.id;
}

export async function resolveDispute(disputeId: string, resolution: string, status: 'resolved' | 'rejected', adminId: string) {
  await updateDoc(doc(db, 'disputes', disputeId), {
    status, resolution, resolvedBy: adminId, resolvedAt: serverTimestamp(),
  });
}

export function listenDisputes(cb: (list: Dispute[]) => void) {
  const q = query(collection(db, 'disputes'), orderBy('createdAt', 'desc'), limit(100));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Dispute)));
  }, () => cb([]));
}
