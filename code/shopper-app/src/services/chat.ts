import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, limit } from 'firebase/firestore';
import { db } from '../firebase';

export type ChatMessage = {
  id?: string;
  orderId: string;
  senderId: string;
  senderRole: 'customer' | 'shopper' | 'rider' | 'system';
  senderName: string;
  text: string;
  createdAt?: any;
  type?: 'text' | 'substitution' | 'system';
  meta?: Record<string, any>;
};

export async function sendMessage(msg: Omit<ChatMessage, 'id' | 'createdAt'>) {
  const ref = collection(db, 'orders', msg.orderId, 'messages');
  await addDoc(ref, { ...msg, createdAt: serverTimestamp() });
}

export function listenMessages(orderId: string, cb: (messages: ChatMessage[]) => void) {
  const q = query(collection(db, 'orders', orderId, 'messages'), orderBy('createdAt', 'asc'), limit(200));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage)));
  }, () => cb([]));
}

export async function sendSystemMessage(orderId: string, text: string) {
  return sendMessage({
    orderId, senderId: 'system', senderRole: 'system', senderName: 'Shopper', text, type: 'system',
  });
}
