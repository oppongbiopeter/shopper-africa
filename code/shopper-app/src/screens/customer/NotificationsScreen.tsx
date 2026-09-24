import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { listenNotifications, markRead, AppNotification } from '../../services/notifications';

export default function NotificationsScreen({ route, navigation }: any) {
  const userId = route?.params?.userId || 'demo-user';
  const [list, setList] = useState<AppNotification[]>([]);
  useEffect(() => listenNotifications(userId, setList), [userId]);
  const open = async (n: AppNotification) => {
    if (n.id && !n.read) await markRead(userId, n.id);
    if (n.orderId) {
      if (n.type === 'rating_request') navigation.navigate('RateOrder', { orderId: n.orderId, userId });
      else navigation.navigate('OrderDetail', { orderId: n.orderId, userId });
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList data={list} keyExtractor={(i) => i.id || String(i.createdAt)} contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={styles.empty}>No notifications yet</Text>}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, !item.read && styles.unread]} onPress={() => open(item)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardBody}>{item.body}</Text>
            <Text style={styles.type}>{item.type.replace(/_/g, ' ')}</Text>
          </TouchableOpacity>
        )} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  title: { fontSize: 22, fontWeight: '800', padding: 16 },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  unread: { borderColor: '#FFCC00', backgroundColor: '#FFFDE7' },
  cardTitle: { fontWeight: '700', fontSize: 15 },
  cardBody: { fontSize: 13, color: '#444', marginTop: 4 },
  type: { fontSize: 11, color: '#888', marginTop: 6, textTransform: 'capitalize' },
});
