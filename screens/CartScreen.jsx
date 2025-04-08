import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import ProductCard from '../components/productCard';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);

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
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            inCart={true}
            onRemoveFromCart={handleRemoveItem}
            onUpdateQuantity={updateQuantity}
            onPress={() => navigation.navigate('Details', { product: item })}
          />
        )}
      />
      {cart.length > 0 && (
        <Button title="Clear Cart" onPress={clearCart} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});

export default CartScreen;
