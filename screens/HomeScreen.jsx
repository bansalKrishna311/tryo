import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { products } from '../data/products';
import ProductCard from '../components/productCard';
import Animated, { FadeInDown } from 'react-native-reanimated';

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <TextInput
        placeholder="🔍 Search products..."
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
        placeholderTextColor="#888"
      />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <Animated.View
              entering={FadeInDown.delay(index * 80)}
              key={product.id}
            >
              <ProductCard
                product={product}
                onPress={() => navigation.navigate('Details', { product })}
              />
            </Animated.View>
          ))
        ) : (
          <Animated.View entering={FadeInDown.duration(300)}>
            <Text style={styles.noResults}>No results found 😕</Text>
          </Animated.View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  container: {
    flexGrow: 1,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    color: '#777',
  },
});

export default HomeScreen;
