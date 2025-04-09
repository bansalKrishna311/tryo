import React, { useCallback, useState, useRef, useMemo, memo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  Pressable,
  Image,
  useColorScheme,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  withTiming,
  withSpring,
  withDelay,
  withSequence,  // Add this import
  useAnimatedStyle,
  Extrapolation,
  interpolate,
  SlideInRight,
  FadeIn,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedHeader from '../components/AnimatedHeader';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaskedView from '@react-native-masked-view/masked-view';

const { width, height } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const CartScreen = ({ navigation }) => {
  const [cart, setCart] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  const scrollY = useSharedValue(0);
  const btnScale = useSharedValue(0);
  const emptyAnimValue = useSharedValue(0);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(emptyAnimValue.value, [0, 1], [0, 1], Extrapolation.CLAMP),
      transform: [
        { translateY: interpolate(emptyAnimValue.value, [0, 1], [50, 0], Extrapolation.CLAMP) },
      ],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const loadCart = async () => {
    try {
      const stored = await AsyncStorage.getItem('cart');
      if (!stored) {
        setCart([]);
        emptyAnimValue.value = withTiming(1, { duration: 600 });
        return;
      }

      let loadedCart;
      try {
        loadedCart = JSON.parse(stored);
        // Validate cart data structure
        if (!Array.isArray(loadedCart)) {
          throw new Error('Invalid cart data');
        }
        // Sanitize and validate each item
        loadedCart = loadedCart.filter(item => (
          item && 
          typeof item === 'object' && 
          item.id && 
          typeof item.price === 'number' &&
          item.quantity > 0
        ));
      } catch (parseError) {
        console.error('Cart data parsing error:', parseError);
        loadedCart = [];
      }

      setCart(loadedCart);
      
      if (loadedCart.length === 0) {
        emptyAnimValue.value = withTiming(1, { duration: 600 });
      } else {
        btnScale.value = withDelay(300, withSpring(1, { damping: 12 }));
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      Alert.alert('Error', 'Failed to load cart items');
    }
  };

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      loadCart();
      return () => {
        btnScale.value = 0;
        emptyAnimValue.value = 0;
      };
    }, [])
  );

  const clearCart = async () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('cart');
            setCart([]);
            emptyAnimValue.value = withTiming(1, { duration: 600 });
          },
        },
      ]
    );
  };

  const handleRemoveItem = async (id) => {
    try {
      const updatedCart = cart.filter(item => item.id !== id);
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      
      if (updatedCart.length === 0) {
        btnScale.value = withTiming(0, { duration: 300 });
        emptyAnimValue.value = withDelay(300, withTiming(1, { duration: 600 }));
      }
    } catch (error) {
      console.error('Error removing item:', error);
      Alert.alert('Error', 'Failed to remove item from cart');
    }
  };

  const updateQuantity = async (id, newQty) => {
    try {
      // Input validation
      if (!Number.isInteger(newQty) || newQty < 1 || newQty > 99) {
        return;
      }

      const itemIndex = cart.findIndex(item => item.id === id);
      if (itemIndex === -1) return;

      const updatedCart = [...cart];
      updatedCart[itemIndex] = { ...updatedCart[itemIndex], quantity: newQty };
      
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update item quantity');
    }
  };

  const total = useMemo(() => 
    cart.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseInt(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0)
  , [cart]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadCart().then(() => setRefreshing(false));
  }, []);

  const renderRightActions = (id) => (
    <TouchableOpacity 
      style={styles.deleteButton} 
      onPress={() => handleRemoveItem(id)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={['#ff4d4d', '#ff0000']}
        style={styles.deleteGradient}
      >
        <Icon name="trash" size={24} color="white" />
        <Text style={styles.deleteText}>Remove</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderItem = useCallback(({ item, index }) => (
    <Animated.View 
      entering={SlideInRight.delay(index * 100).springify()}
    >
      <Swipeable renderRightActions={() => renderRightActions(item.id)}>
        <CartItem 
          item={item} 
          onUpdateQuantity={updateQuantity}
          onRemoveFromCart={handleRemoveItem}
          onPress={() => navigation.navigate('Details', { product: item })}
          isDark={isDark}
        />
      </Swipeable>
    </Animated.View>
  ), [isDark]);

  const checkoutBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: btnScale.value }],
      opacity: btnScale.value,
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={[styles.container, isDark && styles.darkContainer]}>
        <AnimatedHeader 
          scrollY={scrollY} 
          navigation={navigation} 
          title="Shopping Cart"
          subtitle={`${cart.length} items waiting for you`}
        />
        
        {cart.length === 0 ? (
          <Animated.View style={[styles.emptyContainer, animatedStyle]}>
            <Image
              source={require('../assets/empty-cart.png')}
              style={styles.emptyImage}
              resizeMode="contain"
            />
            <Text style={[styles.emptyTitle, isDark && styles.darkText]}>
              Your cart is empty
            </Text>
            <Text style={[styles.emptySubtitle, isDark && styles.darkSubText]}>
              Looks like you haven't added any items to your cart yet.
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => navigation.navigate('Home')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={['#1a2a6c', '#b21f1f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shopBtnGradient}
              >
                <Text style={styles.shopBtnText}>Start Shopping</Text>
                <Icon name="arrow-forward" size={18} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <>
            <AnimatedFlatList
              data={cart}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              onScroll={scrollHandler}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh}
                  tintColor={isDark ? "#fff" : "#1a2a6c"}
                />
              }
              ListHeaderComponent={() => <View style={{ height: 120 }} />}
              ListFooterComponent={() => <View style={{ height: 150 }} />}
            />
            
            <Animated.View style={[styles.footer, checkoutBtnStyle]}>
              <LinearGradient
                colors={isDark ? ['#111111DD', '#000000FF'] : ['#FFFFFFDD', '#FFFFFFFF']}
                style={styles.footerGradient}
              >
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, isDark && styles.darkText]}>
                    Total Amount
                  </Text>
                  <Text style={[styles.totalAmount, isDark && styles.darkText]}>
                    ₹ {total.toFixed(2)}
                  </Text>
                </View>
                
                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.clearBtn}
                    onPress={clearCart}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.clearText}>Clear All</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={styles.checkoutBtn}
                    onPress={() => Alert.alert('Checkout', 'Processing your order...')}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={['#1a2a6c', '#b21f1f']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.checkoutGradient}
                    >
                      <Text style={styles.checkoutText}>Checkout</Text>
                      <Icon name="chevron-forward" size={18} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </>
        )}
      </View>
    </GestureHandlerRootView>
  );
};

// CartItem component for better organization
const CartItem = memo(({ item, onUpdateQuantity, onRemoveFromCart, onPress, isDark }) => {
  const itemAnim = useSharedValue(1);
  
  const animatedItemStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: itemAnim.value }],
    };
  });
  
  const handleDecrement = useCallback(() => {
    if (item.quantity > 1) {
      itemAnim.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  }, [item.quantity, item.id]);
  
  const handleIncrement = useCallback(() => {
    if (item.quantity < 99) {
      itemAnim.value = withSequence(
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
      onUpdateQuantity(item.id, item.quantity + 1);
    }
  }, [item.quantity, item.id]);
  
  return (
    <Animated.View style={[
      styles.cartItem, 
      isDark && styles.darkCartItem,
      animatedItemStyle
    ]}>
      <TouchableOpacity 
        style={styles.itemImageContainer} 
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image 
          source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
          style={styles.itemImage} 
          resizeMode="cover"
        />
      </TouchableOpacity>
      
      <View style={styles.itemDetails}>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <Text style={[styles.itemName, isDark && styles.darkText]} numberOfLines={1}>
            {item.name || item.title}
          </Text>
        </TouchableOpacity>
        
        <View style={styles.itemVariant}>
          <Text style={[styles.variantText, isDark && styles.darkSubText]} numberOfLines={1}>
            {item.variant || item.category || 'Standard'}
          </Text>
        </View>
        
        <View style={styles.priceRow}>
          <View>
            <MaskedView
              style={{ height: 24 }}
              maskElement={
                <Text style={styles.itemPrice}>₹ {parseFloat(item.price).toFixed(2)}</Text>
              }
            >
              <LinearGradient
                colors={['#1a2a6c', '#b21f1f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </MaskedView>
            <Text style={[styles.itemTotal, isDark && styles.darkSubText]}>
              Total: ₹ {(parseFloat(item.price) * item.quantity).toFixed(2)}
            </Text>
          </View>
          
          <View style={styles.quantityControl}>
            <TouchableOpacity 
              style={[styles.qtyBtn, { opacity: item.quantity > 1 ? 1 : 0.5 }]} 
              onPress={handleDecrement}
              disabled={item.quantity <= 1}
            >
              <Icon name="remove" size={18} color={isDark ? "#fff" : "#333"} />
            </TouchableOpacity>
            
            <Text style={[styles.quantity, isDark && styles.darkText]}>
              {item.quantity}
            </Text>
            
            <TouchableOpacity style={styles.qtyBtn} onPress={handleIncrement}>
              <Icon name="add" size={18} color={isDark ? "#fff" : "#333"} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8f9fa'
  },
  darkContainer: { 
    backgroundColor: '#121212' 
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 8,
    borderRadius: 16,
    padding: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkCartItem: {
    backgroundColor: '#1e1e1e',
    shadowColor: '#000',
    shadowOpacity: 0.2,
  },
  itemImageContainer: {
    width: 85,
    height: 85,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  itemImage: {
    width: '100%',
    height: '100%',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  itemVariant: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  variantText: {
    fontSize: 12,
    color: '#666',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
  },
  itemTotal: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 4,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  quantity: {
    paddingHorizontal: 12,
    fontSize: 14,
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
  },
  footerGradient: {
    paddingTop: 16,
    paddingHorizontal: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 16,
    color: '#666',
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a2a6c',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clearBtn: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
  },
  clearText: {
    color: '#ff4d4d',
    fontWeight: '600',
    fontSize: 14,
  },
  checkoutBtn: {
    width: '65%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  checkoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  checkoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    marginRight: 4,
  },
  deleteButton: {
    width: 100,
    marginVertical: 8,
    overflow: 'hidden',
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  deleteGradient: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  deleteText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  emptyImage: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginBottom: 32,
  },
  shopButton: {
    width: '80%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  shopBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  shopBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  darkText: { 
    color: '#fff' 
  },
  darkSubText: { 
    color: '#aaa' 
  },
});

export default CartScreen;