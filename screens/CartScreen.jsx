import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  Pressable,
  Image,
  useColorScheme,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import ProductCard from '../components/productCard'; // Make sure it's updated!

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useColorScheme();

  const loadCart = async () => {
    const stored = await AsyncStorage.getItem('cart');
    setCart(stored ? JSON.parse(stored) : []);
  };

  useFocusEffect(
    useCallback(() => {
      loadCart();
    }, [])
  );

  const clearCart = async () => {
    await AsyncStorage.removeItem('cart');
    setCart([]);
  };
  

  const handleRemoveItem = async (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
    Alert.alert('Removed', 'Item removed from cart');
  };

  const updateQuantity = async (id, newQty) => {
    if (newQty < 1) return;
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + (parseFloat(item.price) || 0) * (item.quantity || 1),
    0
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCart().then(() => setRefreshing(false));
  }, []);

  const renderRightActions = (id) => (
    <Pressable style={styles.deleteButton}  onPress={() => onRemoveFromCart(product.id)}>
      <Icon name="trash" size={24} color="white" />
    </Pressable>
  );

  const renderItem = ({ item }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.id)}>
      <ProductCard
        product={item}
        inCart
        onUpdateQuantity={updateQuantity}
        onRemoveFromCart={handleRemoveItem} // ✅ Pass this prop
        onPress={() => navigation.navigate('Details', { product: item })}
      />
    </Swipeable>
  );
  

  return (
    <View style={[styles.container, theme === 'dark' && styles.darkContainer]}>
      <Text style={[styles.header, theme === 'dark' && styles.darkText]}>Your Cart</Text>

      {cart.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../assets/empty-cart.png')} // Add a static image here
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={[styles.emptyText, theme === 'dark' && styles.darkText]}>
            Your cart is empty
          </Text>
        </View>
      ) : (
        <>
          <FlatList
            data={cart}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          />
          <View style={styles.footer}>
            <Text style={[styles.total, theme === 'dark' && styles.darkText]}>
              Total: ₹ {total.toFixed(2)}
            </Text>
            <Pressable style={styles.checkoutButton} onPress={() => Alert.alert('Checkout', 'Coming soon...')}>
              <Text style={styles.checkoutText}>Checkout</Text>
            </Pressable>
            <Pressable style={styles.clearButton} onPress={clearCart}>
              <Text style={styles.clearText}>Clear Cart</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  darkContainer: { backgroundColor: '#111' },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  darkText: { color: '#fff' },
  total: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  footer: { marginTop: 10, alignItems: 'center' },
  checkoutButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 10,
  },
  checkoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  clearButton: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  clearText: { color: '#fff', fontWeight: '600' },
  deleteButton: {
    backgroundColor: '#ff4d4d',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    marginVertical: 10,
    borderRadius: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  emptyImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  emptyText: { fontSize: 18, color: '#888' },
});

export default CartScreen;
