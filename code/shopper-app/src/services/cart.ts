import AsyncStorage from '@react-native-async-storage/async-storage';

export type CartItem = {
  id: string; name: string; qty: number; price: number;
  storeId?: string; storeName?: string; imageUrl?: string; unit?: string;
};
const CART_KEY = '@shopper/cart_v1';

export async function loadCart(): Promise<CartItem[]> {
  try { const raw = await AsyncStorage.getItem(CART_KEY); return raw ? JSON.parse(raw) : []; }
  catch { return []; }
}
export async function saveCart(items: CartItem[]): Promise<void> {
  await AsyncStorage.setItem(CART_KEY, JSON.stringify(items));
}
export async function addToCart(item: CartItem): Promise<CartItem[]> {
  const cart = await loadCart();
  const existing = cart.find((i) => i.id === item.id);
  if (existing) existing.qty += item.qty; else cart.push({ ...item });
  await saveCart(cart); return cart;
}
export async function updateQty(itemId: string, qty: number): Promise<CartItem[]> {
  let cart = await loadCart();
  if (qty <= 0) cart = cart.filter((i) => i.id !== itemId);
  else { const target = cart.find((i) => i.id === itemId); if (target) target.qty = qty; }
  await saveCart(cart); return cart;
}
export async function removeFromCart(itemId: string): Promise<CartItem[]> {
  const cart = (await loadCart()).filter((i) => i.id !== itemId);
  await saveCart(cart); return cart;
}
export async function clearCart(): Promise<void> { await AsyncStorage.removeItem(CART_KEY); }
export function calcTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}
export type StoreGroup = { storeId: string; storeName: string; items: CartItem[]; subtotal: number };
export function groupByStore(items: CartItem[]): StoreGroup[] {
  const map = new Map<string, StoreGroup>();
  for (const item of items) {
    const sid = item.storeId || 'unknown';
    if (!map.has(sid)) map.set(sid, { storeId: sid, storeName: item.storeName || 'Store', items: [], subtotal: 0 });
    const g = map.get(sid)!; g.items.push(item); g.subtotal += item.price * item.qty;
  }
  return Array.from(map.values());
}
