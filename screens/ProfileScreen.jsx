import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from '../components/productCard';

const ProfileScreen = ({ navigation }) => {
  const [wishlist, setWishlist] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const w = await AsyncStorage.getItem('wishlist');
      const h = await AsyncStorage.getItem('tryHistory');
      setWishlist(JSON.parse(w) || []);
      setHistory(JSON.parse(h) || []);
    };
    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Wishlist</Text>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate('Details', { product: item })} />
        )}
      />
      <Text style={styles.header}>Try-On History</Text>
      <FlatList
        data={history}
        keyExtractor={(item, index) => item.id + index}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => navigation.navigate('Details', { product: item })} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#fff', flex: 1 },
  header: { fontSize: 20, fontWeight: 'bold', marginVertical: 10 }
});

export default ProfileScreen;
