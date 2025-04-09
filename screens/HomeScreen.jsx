// HomeScreen.js
import React, { useState, useLayoutEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Text,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  FadeInDown,
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';

import products from '../data/products';
import ProductCard from '../components/productCard';
import AnimatedHeader from '../components/AnimatedHeader'; // ✅ imported component

const HEADER_MAX_HEIGHT = 120;
const HEADER_SCROLL_DISTANCE = 60;

const HomeScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = useSharedValue(0);
  const searchInputRef = useRef(null);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(
    p =>
      p.name.toLowerCase().includes(search.toLowerCase()) &&
      (selectedCategory === 'All' || p.category === selectedCategory)
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const searchAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [0, HEADER_SCROLL_DISTANCE],
            [0, -10],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [0, HEADER_SCROLL_DISTANCE],
            [1, 0.95],
            Extrapolation.CLAMP
          ),
        },
      ],
    };
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.screen}
    >
      <StatusBar barStyle="light-content" />

<AnimatedHeader
  scrollY={scrollY}
  navigation={navigation}
  height={100}
    title="Welcome Krishna"
  subtitle="Upgrade your style"
/>


      <Animated.View style={[styles.searchContainer, searchAnimatedStyle]}>
        <View style={styles.searchWrapper}>
          <Icon name="search-outline" size={18} color="#777" style={styles.searchIcon} />
          <TextInput
            ref={searchInputRef}
            placeholder="Search premium products..."
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholderTextColor="#777"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')} style={styles.clearButton}>
              <Icon name="close-circle" size={16} color="#777" />
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      <View style={styles.categoryScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScrollContent}
        >
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
        </ScrollView>
      </View>

      <Animated.ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#b21f1f" />
        }
      >
        {filteredProducts.length > 0 ? (
          <View style={styles.productsList}>
            {filteredProducts.map((product, index) => (
              <Animated.View
                entering={FadeInDown.delay(index * 50).springify()}
                key={product.id}
                style={styles.productCardContainer}
              >
                <ProductCard
                  product={product}
                  onPress={() => navigation.navigate('Details', { product })}
                />
              </Animated.View>
            ))}
          </View>
        ) : (
          <Animated.View entering={FadeInDown.duration(300)} style={styles.noResultsContainer}>
            <Icon name="search" size={48} color="#ddd" />
            <Text style={styles.noResults}>No products found</Text>
            <Text style={styles.noResultsSubtitle}>Try a different search term or category</Text>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSearch('');
                setSelectedCategory('All');
                searchInputRef.current?.blur();
              }}
            >
              <Text style={styles.resetButtonText}>Reset filters</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f8f9fa' },
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: HEADER_MAX_HEIGHT + 8,
    marginBottom: 4,
    zIndex: 5,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 50,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    paddingVertical: 8,
  },
  clearButton: { padding: 4 },
  categoryScrollContainer: { marginTop: 8 },
  categoryScrollContent: { paddingHorizontal: 16 },
  categoryButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedCategoryButton: {
    backgroundColor: '#1a2a6c',
    borderColor: '#1a2a6c',
  },
  categoryText: { fontSize: 13, fontWeight: '500', color: '#444' },
  selectedCategoryText: { color: '#fff' },
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 24 },
  productsList: { width: '100%' },
  productCardContainer: { width: '100%', marginBottom: 16 },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },
  noResults: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  noResultsSubtitle: {
    marginTop: 8,
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  resetButton: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#1a2a6c',
    borderRadius: 24,
  },
  resetButtonText: { color: '#fff', fontWeight: '500' },
});

export default HomeScreen;
