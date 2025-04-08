import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import products from '../data/products'; // Updated dataset
import ProductCard from '../components/productCard';
import Animated, { FadeInDown } from 'react-native-reanimated';

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Dynamically generated category list
  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === 'All' || p.category === selectedCategory)
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

      {/* Dynamic Category Buttons */}
      <View style={styles.categoryContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.selectedCategoryButton,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.selectedCategoryText,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
  categoryContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  categoryButton: {
    backgroundColor: '#ccc',
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderRadius: 20,
  },
  selectedCategoryButton: {
    backgroundColor: '#000',
  },
  categoryText: {
    color: '#000',
  },
  selectedCategoryText: {
    color: '#fff',
  },
  noResults: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 18,
    color: '#777',
  },
});

export default HomeScreen;
