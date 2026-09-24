import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getStore, getProducts, Store, Product } from '../../services/stores';
import { addToCart, loadCart } from '../../services/cart';
import OfflineBanner from '../../components/OfflineBanner';

export default function StoreScreen({ route, navigation }: any) {
  const { storeId } = route.params;
  const [store, setStore] = useState<Store | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    (async () => {
      const [s, p, cart] = await Promise.all([getStore(storeId), getProducts(storeId), loadCart()]);
      setStore(s); setProducts(p); setCartCount(cart.reduce((sum, i) => sum + i.qty, 0)); setLoading(false);
    })();
  }, [storeId]);
  const handleAdd = async (product: Product) => {
    const cart = await addToCart({
      id: product.id, name: product.name, qty: 1, price: product.price,
      storeId: product.storeId, storeName: store?.name, unit: product.unit,
    });
    setCartCount(cart.reduce((sum, i) => sum + i.qty, 0));
  };
  if (loading) return <View style={styles.center}><ActivityIndicator color="#FFCC00" /></View>;
  return (
    <View style={styles.container}>
      <OfflineBanner />
      <View style={styles.header}>
        <Text style={styles.title}>{store?.name || 'Store'}</Text>
        <Text style={styles.meta}>{store?.area} · ★ {store?.rating.toFixed(1)} · {store?.deliveryMinutes} min</Text>
        {store?.supportsDrone && <Text style={styles.drone}>Drone delivery available from this store</Text>}
      </View>
      <FlatList data={products} keyExtractor={(i) => i.id} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.product}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.price}>GHS {item.price.toFixed(2)}{item.unit ? ` / ${item.unit}` : ''}</Text>
              {!item.inStock && <Text style={styles.oos}>Out of stock</Text>}
            </View>
            <TouchableOpacity style={[styles.addBtn, !item.inStock && styles.addDisabled]} onPress={() => handleAdd(item)} disabled={!item.inStock}>
              <Text style={styles.addText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        )} />
      <TouchableOpacity style={styles.cartBar} onPress={() => navigation.navigate('Cart')}>
        <Text style={styles.cartText}>View cart ({cartCount})</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }, center: { flex: 1, justifyContent: 'center' },
  header: { padding: 16, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 22, fontWeight: '900' }, meta: { color: '#666', marginTop: 4 }, drone: { marginTop: 6, color: '#1565C0' },
  product: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  productName: { fontWeight: '600' }, price: { color: '#666', fontSize: 13 }, oos: { color: '#C62828', fontSize: 12 },
  addBtn: { backgroundColor: '#FFCC00', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  addDisabled: { backgroundColor: '#eee' }, addText: { fontWeight: '700' },
  cartBar: { position: 'absolute', bottom: 16, left: 16, right: 16, backgroundColor: '#000', padding: 16, borderRadius: 12, alignItems: 'center' },
  cartText: { color: '#FFCC00', fontWeight: '800' },
});
