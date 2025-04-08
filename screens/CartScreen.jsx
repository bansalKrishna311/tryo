import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/productCard';

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      const stored = await AsyncStorage.getItem('cart');
      setCart(stored ? JSON.parse(stored) : []);
    };
    loadCart();
  }, []);

  const clearCart = async () => {
    await AsyncStorage.removeItem('cart');
    setCart([]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Your Cart</Text>
      <FlatList
        data={cart}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate('Details', { product: item })} />
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
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 }
});

export default CartScreen;
