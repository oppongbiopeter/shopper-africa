import { collection, query, where, getDocs, doc, getDoc, onSnapshot, limit } from 'firebase/firestore';
import { db } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Store = {
  id: string; name: string;
  type: 'supermarket' | 'market' | 'pharmacy' | 'restaurant' | 'local' | 'other';
  area: string; city: string; imageUrl?: string; rating: number; deliveryMinutes: number;
  supportsDrone: boolean; isOpen: boolean;
};
export type Product = {
  id: string; storeId: string; name: string; price: number; unit?: string; category: string;
  imageUrl?: string; inStock: boolean; description?: string;
};
const STORES_CACHE = '@shopper/stores_cache';
const PRODUCTS_CACHE = '@shopper/products_cache';

export async function getStores(city = 'Accra'): Promise<Store[]> {
  try {
    const q = query(collection(db, 'stores'), where('city', '==', city), where('isOpen', '==', true), limit(50));
    const snap = await getDocs(q);
    const stores = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Store));
    await AsyncStorage.setItem(STORES_CACHE, JSON.stringify(stores));
    return stores;
  } catch {
    const raw = await AsyncStorage.getItem(STORES_CACHE);
    return raw ? JSON.parse(raw) : [];
  }
}
export async function getStore(storeId: string): Promise<Store | null> {
  try {
    const snap = await getDoc(doc(db, 'stores', storeId));
    return snap.exists() ? ({ id: snap.id, ...snap.data() } as Store) : null;
  } catch {
    const raw = await AsyncStorage.getItem(STORES_CACHE);
    const list: Store[] = raw ? JSON.parse(raw) : [];
    return list.find((s) => s.id === storeId) || null;
  }
}
export async function getProducts(storeId: string): Promise<Product[]> {
  try {
    const q = query(collection(db, 'products'), where('storeId', '==', storeId), where('inStock', '==', true), limit(100));
    const snap = await getDocs(q);
    const products = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Product));
    const raw = await AsyncStorage.getItem(PRODUCTS_CACHE);
    const all: Record<string, Product[]> = raw ? JSON.parse(raw) : {};
    all[storeId] = products;
    await AsyncStorage.setItem(PRODUCTS_CACHE, JSON.stringify(all));
    return products;
  } catch {
    const raw = await AsyncStorage.getItem(PRODUCTS_CACHE);
    const all: Record<string, Product[]> = raw ? JSON.parse(raw) : {};
    return all[storeId] || [];
  }
}
export function listenStore(storeId: string, cb: (store: Store | null) => void) {
  return onSnapshot(doc(db, 'stores', storeId),
    (snap) => cb(snap.exists() ? ({ id: snap.id, ...snap.data() } as Store) : null), () => cb(null));
}
