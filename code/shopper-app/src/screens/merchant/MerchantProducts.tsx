import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';

export default function MerchantProducts({ route }: any) {
  const storeId = route?.params?.storeId || 'store-demo';
  const [products, setProducts] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  useEffect(() => {
    const q = query(collection(db, 'products'), where('storeId', '==', storeId));
    return onSnapshot(q, (snap) => setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
  }, [storeId]);
  const toggleStock = async (id: string, current: boolean) => {
    await updateDoc(doc(db, 'products', id), { inStock: !current });
  };
  const addProduct = async () => {
    if (!name.trim() || !price) { Alert.alert('Enter name and price'); return; }
    await addDoc(collection(db, 'products'), {
      storeId, name: name.trim(), price: parseFloat(price), unit: 'piece', category: 'general',
      inStock: true, createdAt: serverTimestamp(),
    });
    setName(''); setPrice('');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <View style={styles.addBox}>
        <TextInput style={styles.input} placeholder="Product name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Price (GHS)" value={price} onChangeText={setPrice} keyboardType="decimal-pad" />
        <TouchableOpacity style={styles.addBtn} onPress={addProduct}><Text style={styles.addText}>Add Product</Text></TouchableOpacity>
      </View>
      <FlatList data={products} keyExtractor={(i) => i.id} contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>GHS {Number(item.price).toFixed(2)}</Text>
            </View>
            <TouchableOpacity style={[styles.stockBtn, item.inStock ? styles.inStock : styles.outStock]} onPress={() => toggleStock(item.id, item.inStock)}>
              <Text style={styles.stockText}>{item.inStock ? 'In Stock' : 'Out of Stock'}</Text>
            </TouchableOpacity>
          </View>
        )} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' }, title: { fontSize: 20, fontWeight: '800', padding: 16 },
  addBox: { paddingHorizontal: 16, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8 },
  addBtn: { backgroundColor: '#FFCC00', padding: 12, borderRadius: 8, alignItems: 'center' }, addText: { fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: '#f0f0f0' },
  name: { fontWeight: '600' }, price: { fontSize: 13, color: '#666' },
  stockBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  inStock: { backgroundColor: '#E8F5E9' }, outStock: { backgroundColor: '#FFEBEE' }, stockText: { fontSize: 12, fontWeight: '600' },
});
