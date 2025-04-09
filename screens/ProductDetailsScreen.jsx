import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  useColorScheme,
  Platform,
  Share,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  FadeIn,
  FadeInDown,
} from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import productsData from '../data/products';

const { width, height } = Dimensions.get('window');
const AnimatedImage = Animated.createAnimatedComponent(Image);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const theme = useColorScheme();
  const isDark = theme === 'dark';
  
  // Animation values
  const scrollY = useSharedValue(0);
  const headerOpacity = useSharedValue(0);
  const imageScale = useSharedValue(1);
  const contentOpacity = useSharedValue(0);
  const btnScale = useSharedValue(0);
  const heartScale = useSharedValue(1);
  
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    loadWishlistStatus();
    loadCartStatus();
    loadSimilarProducts();
    
    // Trigger animations
    headerOpacity.value = withTiming(1, { duration: 500 });
    contentOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    btnScale.value = withDelay(500, withSpring(1, { damping: 12 }));
    
    return () => {
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
    };
  }, []);
  
  const loadSimilarProducts = () => {
    // Filter products from the same category but exclude current product
    const similar = productsData
      .filter(item => 
        item.category === product.category && 
        item.id !== product.id
      )
      .slice(0, 3); // Get only 3 similar products
    
    setSimilarProducts(similar);
  };
  
  const loadWishlistStatus = async () => {
    try {
      const wishlist = await AsyncStorage.getItem('wishlist');
      const items = wishlist ? JSON.parse(wishlist) : [];
      setIsInWishlist(items.some(item => item.id === product.id));
    } catch (error) {
      console.log('Error checking wishlist status:', error);
    }
  };
  
  const loadCartStatus = async () => {
    try {
      const cart = await AsyncStorage.getItem('cart');
      if (cart) {
        const items = JSON.parse(cart);
        const existingItem = items.find(item => item.id === product.id);
        setIsInCart(!!existingItem);
      }
    } catch (error) {
      console.log('Error checking cart status:', error);
    }
  };
  
  const toggleWishlist = async () => {
    try {
      // Animate heart button
      heartScale.value = withSequence(
        withTiming(1.3, { duration: 150 }),
        withTiming(1, { duration: 150 })
      );
      
      const wishlist = await AsyncStorage.getItem('wishlist');
      const items = wishlist ? JSON.parse(wishlist) : [];
      
      if (isInWishlist) {
        const newWishlist = items.filter(item => item.id !== product.id);
        await AsyncStorage.setItem('wishlist', JSON.stringify(newWishlist));
      } else {
        items.push(product);
        await AsyncStorage.setItem('wishlist', JSON.stringify(items));
      }
      
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.log('Error updating wishlist:', error);
    }
  };
  
  const addToCart = async () => {
    try {
      const cartStr = await AsyncStorage.getItem('cart');
      let cartItems = [];
      
      if (cartStr) {
        cartItems = JSON.parse(cartStr);
      }
  
      const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
  
      if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cartItems[existingItemIndex].quantity += 1;
      } else {
        // Add new item with quantity 1
        cartItems.push({ ...product, quantity: 1 });
      }
  
      await AsyncStorage.setItem('cart', JSON.stringify(cartItems));
      setIsInCart(true);
  
      // Animate button
      btnScale.value = withSequence(
        withTiming(0.95, { duration: 100 }),
        withTiming(1.05, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
  
      // Navigate to cart
      navigation.navigate('Cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this product: ${product.name} - ${product.price}`,
        url: product.image,
      });
    } catch (error) {
      console.log('Error sharing product:', error);
    }
  };
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      
      // Scale image slightly when scrolling
      if (event.contentOffset.y <= 0) {
        const newScale = interpolate(
          event.contentOffset.y,
          [-100, 0],
          [1.1, 1],
          Extrapolation.CLAMP
        );
        imageScale.value = newScale;
      }
    },
  });
  
  const headerAnimStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [0, 1],
      Extrapolation.CLAMP
    );
    
    return {
      opacity,
    };
  });
  
  const imageAnimStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: imageScale.value }],
    };
  });
  
  const contentAnimStyle = useAnimatedStyle(() => {
    return {
      opacity: contentOpacity.value,
    };
  });
  
  const actionBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: btnScale.value }],
    };
  });
  
  const heartBtnStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: heartScale.value }],
    };
  });
  
  const renderSimilarItem = (item, index) => (
    <TouchableOpacity 
      style={styles.similarItem}
      activeOpacity={0.9}
      onPress={() => navigation.replace('Details', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.similarImage} />
      <Text style={[styles.similarName, isDark && styles.darkText]} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={[styles.similarPrice, isDark && styles.darkSubText]}>
        {item.price}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      {/* Animated Header */}
      <Animated.View style={[styles.header, headerAnimStyle]}>
        <LinearGradient
          colors={isDark ? ['#000000', '#00000000'] : ['#FFFFFF', '#FFFFFF00']}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-back" size={24} color={isDark ? "#FFF" : "#333"} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, isDark && styles.darkText]} numberOfLines={1}>
              {product.name}
            </Text>
            <TouchableOpacity 
              style={styles.shareBtn}
              onPress={handleShare}
            >
              <Icon name="share-outline" size={22} color={isDark ? "#FFF" : "#333"} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </Animated.View>
      
      {/* Main Content */}
      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        bounces={true}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <AnimatedImage 
            source={{ uri: product.image || 'https://via.placeholder.com/500/DDDDDD?text=Product+Image' }} 
            style={[styles.image, imageAnimStyle]} 
            resizeMode="cover"
          />
          
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>
          
          <Animated.View style={[styles.wishlistBtn, heartBtnStyle]}>
            <TouchableOpacity 
              style={[
                styles.wishlistBtnInner, 
                isInWishlist && styles.activeWishlistBtn
              ]}
              onPress={toggleWishlist}
              activeOpacity={0.9}
            >
              <Icon 
                name={isInWishlist ? "heart" : "heart-outline"} 
                size={20} 
                color={isInWishlist ? "#FFF" : "#333"} 
              />
            </TouchableOpacity>
          </Animated.View>
          
          <TouchableOpacity 
            style={styles.shareButton}
            onPress={handleShare}
          >
            <Icon name="share-social-outline" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        {/* Product Details */}
        <Animated.View 
          style={[styles.detailsContainer, contentAnimStyle]}
          entering={FadeInDown.delay(200).springify()}
        >
          <View style={styles.basicInfo}>
            <View style={styles.nameContainer}>
              <Text style={[styles.categoryTag, isDark && styles.darkCategoryTag]}>
                {product.category || "Fashion"}
              </Text>
              <Text style={[styles.name, isDark && styles.darkText]}>
                {product.name || product.title}
              </Text>
            </View>
            
            <MaskedView
              maskElement={
                <Text style={styles.price}>
                  {product.price}
                </Text>
              }
            >
              <LinearGradient
                colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            </MaskedView>
          </View>
          
          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((_, index) => (
                <Icon 
                  key={index} 
                  name={index < 4 ? "star" : "star-half-outline"} 
                  size={16} 
                  color="#fdbb2d" 
                  style={styles.starIcon}
                />
              ))}
              <Text style={[styles.ratingText, isDark && styles.darkSubText]}>4.5</Text>
            </View>
            <Text style={[styles.reviewCount, isDark && styles.darkSubText]}>
              (128 reviews)
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.descriptionContainer}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              Description
            </Text>
            <Text style={[styles.description, isDark && styles.darkSubText]}>
              {product.description || 
                "This premium product features high-quality materials and exceptional craftsmanship. Perfect for any occasion, it combines style and functionality to enhance your everyday experience. With its sleek design and practical features, this product is designed to meet your needs while adding a touch of elegance to your lifestyle."}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.featuresContainer}>
            <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
              Features
            </Text>
            
            <View style={styles.featuresList}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, isDark && styles.darkFeatureIcon]}>
                  <Icon name="checkmark" size={16} color={isDark ? "#fdbb2d" : "#1a2a6c"} />
                </View>
                <Text style={[styles.featureText, isDark && styles.darkSubText]}>
                  Premium Quality
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, isDark && styles.darkFeatureIcon]}>
                  <Icon name="checkmark" size={16} color={isDark ? "#fdbb2d" : "#1a2a6c"} />
                </View>
                <Text style={[styles.featureText, isDark && styles.darkSubText]}>
                  Comfortable Fit
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, isDark && styles.darkFeatureIcon]}>
                  <Icon name="checkmark" size={16} color={isDark ? "#fdbb2d" : "#1a2a6c"} />
                </View>
                <Text style={[styles.featureText, isDark && styles.darkSubText]}>
                  Easy Maintenance
                </Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, isDark && styles.darkFeatureIcon]}>
                  <Icon name="checkmark" size={16} color={isDark ? "#fdbb2d" : "#1a2a6c"} />
                </View>
                <Text style={[styles.featureText, isDark && styles.darkSubText]}>
                  Durable Materials
                </Text>
              </View>
            </View>
          </View>
          
          {similarProducts.length > 0 && (
            <>
              <View style={styles.divider} />
              
              <View style={styles.similarContainer}>
                <Text style={[styles.sectionTitle, isDark && styles.darkText]}>
                  You may also like
                </Text>
                
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.similarList}
                >
                  {similarProducts.map((item, index) => (
                    <Animated.View 
                      key={item.id}
                      entering={FadeIn.delay(300 + (index * 100)).springify()}
                    >
                      {renderSimilarItem(item, index)}
                    </Animated.View>
                  ))}
                </ScrollView>
              </View>
            </>
          )}
        </Animated.View>
      </AnimatedScrollView>
      
      {/* Action Buttons */}
      <Animated.View style={[styles.footer, actionBtnStyle]}>
        <TouchableOpacity
          style={styles.tryOnButton}
          onPress={() => navigation.navigate('TryOn', { product })}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#1a2a6c', '#b21f1f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.tryOnGradient}
          >
            <Icon name="scan-outline" size={20} color="#FFF" style={styles.btnIcon} />
            <Text style={styles.btnText}>Try It On</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.cartButton}
          onPress={addToCart}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={isInCart ? ['#4CAF50', '#2E7D32'] : ['#fdbb2d', '#b21f1f']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cartGradient}
          >
            <Icon 
              name={isInCart ? "checkmark" : "cart-outline"} 
              size={20} 
              color="#FFF"
              style={styles.btnIcon} 
            />
            <Text style={styles.btnText}>
              {isInCart ? "Added to Cart" : "Add to Cart"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    height: 60,
  },
  headerGradient: {
    flex: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 60,
    paddingTop: Platform.OS === 'ios' ? 8 : 0,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginHorizontal: 16,
    textAlign: 'center',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  shareBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  imageContainer: {
    height: height * 0.55,
    width: width,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  wishlistBtn: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 16,
    width: 40,
    height: 40,
    zIndex: 5,
  },
  wishlistBtnInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeWishlistBtn: {
    backgroundColor: '#ff4d4d',
  },
  shareButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 66,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  detailsContainer: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  basicInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameContainer: {
    flex: 1,
    marginRight: 16,
  },
  categoryTag: {
    backgroundColor: 'rgba(26, 42, 108, 0.1)',
    color: '#1a2a6c',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '500',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  darkCategoryTag: {
    backgroundColor: 'rgba(253, 187, 45, 0.2)',
    color: '#fdbb2d',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 4,
  },
  reviewCount: {
    fontSize: 14,
    color: '#888',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featuresList: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(26, 42, 108, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  darkFeatureIcon: {
    backgroundColor: 'rgba(253, 187, 45, 0.15)',
  },
  featureText: {
    fontSize: 14,
    color: '#555',
  },
  similarContainer: {
    marginBottom: 20,
  },
  similarList: {
    paddingVertical: 10,
  },
  similarItem: {
    width: 140,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  similarImage: {
    width: '100%',
    height: 140,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  similarName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 4,
  },
  similarPrice: {
    fontSize: 12,
    color: '#666',
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 10,
  },
  tryOnButton: {
    flex: 1,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tryOnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  cartButton: {
    flex: 1.5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  cartGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  btnIcon: {
    marginRight: 8,
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#aaa',
  },
});

export default ProductDetailsScreen;