import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const ProductCard = ({ product, onPress, onSave }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const scale = useSharedValue(1);

  useEffect(() => {
    const checkWishlist = async () => {
      try {
        const stored = await AsyncStorage.getItem('wishlist');
        const wishlist = stored ? JSON.parse(stored) : [];
        const exists = wishlist.some(item => item.id === product.id);
        setIsWishlisted(exists);
      } catch (e) {
        console.log(e);
      }
    };
    checkWishlist();
  }, []);

  const handleSave = async () => {
    if (!isWishlisted) {
      await onSave(product);
      setIsWishlisted(true);
      scale.value = withSpring(1.5, { damping: 5 });
      setTimeout(() => {
        scale.value = withSpring(1);
      }, 150);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <View style={{ flexDirection: 'row', marginTop: 6 }}>
  {[...Array(5)].map((_, i) => (
    <Icon key={i} name="star" size={18} color={i < 4 ? '#ffc107' : '#ddd'} />
  ))}
</View>

      {/* Animated Heart Icon */}
      <TouchableOpacity onPress={handleSave} style={styles.heartIcon}>
        <Animated.View style={animatedStyle}>
          <Icon
            name={isWishlisted ? 'heart' : 'heart-outline'}
            size={24}
            color={isWishlisted ? '#f00' : '#f44'}
          />
        </Animated.View>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    padding: 10
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 10
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  price: {
    color: '#666',
    fontSize: 16,
    marginTop: 4
  },
  heartIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    elevation: 5
  }
});

export default ProductCard;
