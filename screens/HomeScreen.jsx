import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { products } from '../data/products';
import ProductCard from '../components/productCard';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onPress={() => navigation.navigate('Details', { product })}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0f0f0'
  }
});

export default HomeScreen;
