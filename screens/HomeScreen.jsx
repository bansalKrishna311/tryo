    import React from 'react';
    import { View, ScrollView, StyleSheet } from 'react-native';
    import { products } from '../data/products';
    import ProductCard from '../components/productCard';
    import AsyncStorage from '@react-native-async-storage/async-storage';

    const saveToWishlist = async (product) => {
    try {
        const stored = await AsyncStorage.getItem('wishlist');
        const wishlist = stored ? JSON.parse(stored) : [];
        const exists = wishlist.find(item => item.id === product.id);
        if (!exists) {
        wishlist.push(product);
        await AsyncStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Added to Wishlist!');
        } else {
        alert('Already in Wishlist');
        }
    } catch (e) {
        console.log(e);
    }
    };

    const HomeScreen = ({ navigation }) => {
    return (
        <ScrollView style={styles.container}>
        {products.map(product => (
            <ProductCard
            onSave={saveToWishlist}
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
