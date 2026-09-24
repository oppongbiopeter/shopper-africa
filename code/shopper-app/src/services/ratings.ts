import { doc, setDoc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { sendNotification } from './notifications';

export type OrderRating = {
  orderId: string;
  customerId: string;
  shopperId?: string;
  shopperStars?: number;
  shopperComment?: string;
  riderId?: string;
  riderStars?: number;
  riderComment?: string;
  overallStars?: number;
  createdAt?: any;
};

export async function submitRating(rating: OrderRating) {
  await setDoc(doc(db, 'ratings', rating.orderId), { ...rating, createdAt: serverTimestamp() });
  if (rating.shopperId && rating.shopperStars) {
    await updateProfileRating('shoppers', rating.shopperId, rating.shopperStars);
  }
  if (rating.riderId && rating.riderStars) {
    await updateProfileRating('agents', rating.riderId, rating.riderStars);
  }
  await updateDoc(doc(db, 'orders', rating.orderId), { rated: true, ratingSubmittedAt: serverTimestamp() });
}

async function updateProfileRating(collectionName: string, id: string, stars: number) {
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const data = snap.data();
  const count = (data.ratingCount || 0) + 1;
  const total = (data.ratingTotal || (data.rating || 5) * (data.ratingCount || 1)) + stars;
  const avg = total / count;
  await updateDoc(ref, { rating: Math.round(avg * 10) / 10, ratingCount: count, ratingTotal: total });
}

export async function requestRating(customerId: string, orderId: string) {
  await sendNotification({
    userId: customerId, type: 'rating_request', title: 'Rate your order',
    body: `How was shopping & delivery for ${orderId}?`, orderId,
  });
}
