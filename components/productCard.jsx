import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { BlurView } from '@react-native-community/blur';
import { LinearGradient } from 'react-native-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');
const cardWidth = screenWidth * 0.92; // Takes 92% of screen width

const ProductCard = ({
  product,
  onPress,
  onSave,
  inCart = false,
  onRemoveFromCart,
  onUpdateQuantity,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const scale = useSharedValue(1);
  const heartAnimation = useSharedValue(0);
  const buttonScale = useSharedValue(1);

  useEffect(() => {
    const init = async () => {
      try {
        const wishlist = JSON.parse(await AsyncStorage.getItem('wishlist')) || [];
        setIsWishlisted(wishlist.some(item => item.id === product.id));

        const cart = JSON.parse(await AsyncStorage.getItem('cart')) || [];
        const item = cart.find(item => item.id === product.id);
        setQuantity(item ? item.quantity : 0);
      } catch (e) {
        console.error(e);
      }
    };
    init();
  }, [product.id]);

  const handleSave = async () => {
    scale.value = withSpring(1.4, { damping: 10 });
    heartAnimation.value = withTiming(isWishlisted ? 0 : 1, { duration: 300 });
    
    setTimeout(() => {
      scale.value = withSpring(1);
    }, 150);
    
    if (!isWishlisted) {
      await onSave?.(product);
    }
    setIsWishlisted(!isWishlisted);
  };

  const heartIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: interpolate(heartAnimation.value, [0, 1], [1, 0.8], Extrapolate.CLAMP),
  }));

  const buttonPressAnimation = () => {
    buttonScale.value = withTiming(0.92, { duration: 100 });
    setTimeout(() => {
      buttonScale.value = withTiming(1, { duration: 100 });
    }, 100);
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const updateCart = async (newQuantity) => {
    try {
      buttonPressAnimation();
      const cart = JSON.parse(await AsyncStorage.getItem('cart')) || [];
      const index = cart.findIndex(item => item.id === product.id);

      if (newQuantity > 0) {
        if (index !== -1) {
          cart[index].quantity = newQuantity;
        } else {
          cart.push({
            ...product,
            price: parseFloat(product.price.replace(/[^\d.]/g, '')),
            quantity: newQuantity,
          });
        }
      } else if (index !== -1) {
        cart.splice(index, 1);
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      setQuantity(newQuantity);
      onUpdateQuantity?.(product.id, newQuantity);
    } catch (err) {
      console.error('Cart update error:', err);
    }
  };

  const increaseQty = () => updateCart(quantity + 1);
  const decreaseQty = () => updateCart(quantity - 1);

  const renderRatingStars = () => {
    const rating = 4;
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Icon
            key={i}
            name={i < rating ? "star" : "star-outline"}
            size={16}
            color={i < rating ? '#FFB800' : '#E0E0E0'}
            style={styles.starIcon}
          />
        ))}
        <Text style={styles.ratingText}>{rating}.0</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.95} 
      onPress={onPress} 
      style={[styles.card, { width: cardWidth }]}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: product.image }} style={styles.image} />
        
        {/* Gradient overlay */}
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'transparent']}
          style={styles.imageGradient}
        />
        
        {/* Discount tag if applicable */}
        {product.discount && (
          <View style={styles.discountTag}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}
        
        <TouchableOpacity 
          onPress={handleSave} 
          style={styles.heartIconContainer}
          activeOpacity={0.9}
        >
          <Animated.View style={heartIconStyle}>
            <Icon
              name={isWishlisted ? 'heart' : 'heart-outline'}
              size={20}
              color={isWishlisted ? '#FF4757' : '#fff'}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category || 'Category'}
        </Text>
        
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        
        {renderRatingStars()}

        <View style={styles.priceRow}>
          <View>
            <Text style={styles.price}>
              {product.price}
            </Text>
            {product.originalPrice && (
              <Text style={styles.originalPrice}>
                {product.originalPrice}
              </Text>
            )}
          </View>

          {quantity === 0 ? (
            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                onPress={() => updateCart(1)}
                style={styles.cartButton}
                activeOpacity={0.9}
              >
                <Icon name="cart-outline" size={16} color="#FFF" />
                <Text style={styles.cartButtonText}>Add</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={decreaseQty}
                style={[styles.qtyButton, quantity <= 1 && styles.qtyButtonRemove]}
                activeOpacity={0.8}
              >
                <Icon
                  name={quantity <= 1 ? "trash-outline" : "remove"}
                  size={16}
                  color={quantity <= 1 ? "#FF4757" : "#333"}
                />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity 
                onPress={increaseQty} 
                style={styles.qtyButton}
                activeOpacity={0.8}
              >
                <Icon name="add" size={16} color="#333" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {inCart && (
          <TouchableOpacity
            onPress={() => {
              updateCart(0);
              onRemoveFromCart?.(product.id);
            }}
            style={styles.removeButton}
            activeOpacity={0.8}
          >
            <Icon name="trash-outline" size={16} color="#FF4757" />
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
    alignSelf: 'center', // Centers the card
    marginVertical: 8,
    width: cardWidth,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: screenWidth * 0.6, // Makes image height responsive
    resizeMode: 'cover',
  },
  imageGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  heartIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 8,
    borderRadius: 50,
    zIndex: 2,
  },
  discountTag: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#FF6B6B', // Changed from red to coral
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16, // Slightly more padding
  },
  category: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 16, // Slightly larger
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 8,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    color: '#888',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  price: {
    fontSize: 18, // Slightly larger
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  originalPrice: {
    fontSize: 13,
    fontWeight: '400',
    color: '#999',
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  cartButton: {
    backgroundColor: '#4A90E2', // Changed from green to blue
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  cartButtonText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: '600',
    fontSize: 13,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderColor: '#F0F0F0',
    borderWidth: 1,
    overflow: 'hidden',
  },
  qtyButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F5F7FA',
  },
  qtyButtonRemove: {
    backgroundColor: '#FFE5E5',
  },
  qtyText: {
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: '600',
    minWidth: 30,
    textAlign: 'center',
  },
  removeButton: {
    marginTop: 12,
    backgroundColor: '#FFE5E5',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  removeButtonText: {
    marginLeft: 6,
    color: '#FF6B6B', // Changed from red to coral
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductCard;