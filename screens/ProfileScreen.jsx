import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  useColorScheme,
  RefreshControl,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  Extrapolation,
  interpolate,
  FadeIn,
  SlideInRight,
} from 'react-native-reanimated';
import MaskedView from '@react-native-masked-view/masked-view';
import AnimatedHeader from '../components/AnimatedHeader';
import ProductCard from '../components/productCard';

const { width } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const ProfileScreen = ({ navigation }) => {
  const [wishlist, setWishlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('wishlist');
  const scrollY = useSharedValue(0);
  const cardScale = useSharedValue(0);
  const statsScale = useSharedValue(0);
  const theme = useColorScheme();
  const isDark = theme === 'dark';

  // Mock user data (replace with actual user data fetching)
  const mockUser = {
    name: 'Krishna Bansal',
    email: 'bansalkrishna311@gmail.com',
    avatar: 'https://theuniquesbackend.vercel.app/api/image-proxy/1iLgcuJh2rXS0fdoyKQB2fx8zEIo-snHj',
    stats: {
      orders: 12,
      reviews: 5,
      points: 320
    }
  };

  const loadData = async () => {
    try {
      const rawHistory = await AsyncStorage.getItem('tryHistory');
      const parsedHistory = JSON.parse(rawHistory) || [];
  
      // Filter try-on and wishlist items from history
      const tryOnItems = parsedHistory.filter(item => item.type === 'tryon');
      const wishlistItems = parsedHistory.filter(item => item.type === 'wishlist');
  
      const userData = await AsyncStorage.getItem('userData');
      setHistory(tryOnItems); // Only try-on items go here
      setWishlist(wishlistItems); // Wishlist filtered from tryHistory
  
      setUser(userData ? JSON.parse(userData) : mockUser);
  
      cardScale.value = withDelay(300, withSpring(1, { damping: 12 }));
      statsScale.value = withDelay(600, withSpring(1, { damping: 14 }));
    } catch (error) {
      console.log('Error loading profile data:', error);
    }
  };
  

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('light-content');
      loadData();
      return () => {
        cardScale.value = 0;
        statsScale.value = 0;
      };
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().then(() => setRefreshing(false));
  }, []);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const profileCardStyle = useAnimatedStyle(() => {
    return {
      opacity: cardScale.value,
      transform: [{ scale: cardScale.value }],
    };
  });

  const statsRowStyle = useAnimatedStyle(() => {
    return {
      opacity: statsScale.value,
      transform: [{ scale: statsScale.value }],
    };
  });

  const renderWishlistItem = ({ item, index }) => (
    <Animated.View entering={SlideInRight.delay(index * 100).springify()}>
      <ProductCard 
        product={item} 
        onPress={() => navigation.navigate('Details', { product: item })} 
        inWishlist
      />
    </Animated.View>
  );

  const renderHistoryItem = ({ item, index }) => (
    <Animated.View entering={SlideInRight.delay(index * 100).springify()}>
      <ProductCard 
        product={item} 
        onPress={() => navigation.navigate('Details', { product: item })} 
        inHistory
      />
    </Animated.View>
  );

  const EmptyListComponent = ({ type }) => (
    <View style={styles.emptyContainer}>
      <Icon 
        name={type === 'wishlist' ? 'heart' : 'time'} 
        size={60} 
        color={isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'} 
      />
      <Text style={[styles.emptyText, isDark && styles.darkText]}>
        {type === 'wishlist' 
          ? "Your wishlist is empty" 
          : "No try-on history yet"}
      </Text>
      <Text style={[styles.emptySubtext, isDark && styles.darkSubText]}>
        {type === 'wishlist' 
          ? "Items you like will appear here" 
          : "Products you've tried will appear here"}
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#1a2a6c', '#b21f1f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.emptyBtnGradient}
        >
          <Text style={styles.emptyBtnText}>
            {type === 'wishlist' ? 'Discover Products' : 'Try Something New'}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <AnimatedHeader 
        scrollY={scrollY} 
        navigation={navigation} 
        title="Your Profile"
        subtitle={user?.name || 'Welcome back'}
      />

      <AnimatedScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            tintColor={isDark ? "#fff" : "#1a2a6c"}
          />
        }
      >
        {/* Profile Header Space */}
        <View style={{ height: 110 }} />
        
        {/* Profile Card */}
        <Animated.View style={[styles.profileCard, isDark && styles.darkProfileCard, profileCardStyle]}>
          <LinearGradient
            colors={isDark ? ['#1e1e1e', '#252525'] : ['#FFFFFF', '#F8F8F8']}
            style={styles.profileCardGradient}
          >
            <View style={styles.profileHeader}>
              <Image 
                source={{ uri: user?.avatar || 'https://i.pravatar.cc/300' }}
                style={styles.avatar}
              />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, isDark && styles.darkText]}>
                  {user?.name || 'User'}
                </Text>
                <Text style={[styles.profileEmail, isDark && styles.darkSubText]}>
                  {user?.email || 'user@example.com'}
                </Text>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editText}>Edit Profile</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>
        
        {/* Stats Row */}
        <Animated.View style={[styles.statsRow, statsRowStyle]}>
          <View style={[styles.statCard, isDark && styles.darkStatCard]}>
            <Icon name="bag-check" size={24} color={isDark ? "#fdbb2d" : "#1a2a6c"} />
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {user?.stats?.orders || 0}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubText]}>Orders</Text>
          </View>
          
          <View style={[styles.statCard, isDark && styles.darkStatCard]}>
            <Icon name="star" size={24} color={isDark ? "#fdbb2d" : "#1a2a6c"} />
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {user?.stats?.reviews || 0}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubText]}>Reviews</Text>
          </View>
          
          <View style={[styles.statCard, isDark && styles.darkStatCard]}>
            <Icon name="trophy" size={24} color={isDark ? "#fdbb2d" : "#1a2a6c"} />
            <Text style={[styles.statValue, isDark && styles.darkText]}>
              {user?.stats?.points || 0}
            </Text>
            <Text style={[styles.statLabel, isDark && styles.darkSubText]}>Points</Text>
          </View>
        </Animated.View>
        
        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'wishlist' && styles.activeTab,
              isDark && styles.darkTab,
              activeTab === 'wishlist' && isDark && styles.darkActiveTab
            ]}
            onPress={() => setActiveTab('wishlist')}
          >
            <Icon 
              name="heart" 
              size={18} 
              color={activeTab === 'wishlist' 
                ? (isDark ? '#fff' : '#1a2a6c') 
                : (isDark ? '#888' : '#888')
              } 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'wishlist' && styles.activeTabText,
                isDark && styles.darkTabText,
                activeTab === 'wishlist' && isDark && styles.darkActiveTabText
              ]}
            >
              Wishlist
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[
              styles.tab, 
              activeTab === 'history' && styles.activeTab,
              isDark && styles.darkTab,
              activeTab === 'history' && isDark && styles.darkActiveTab
            ]}
            onPress={() => setActiveTab('history')}
          >
            <Icon 
              name="time" 
              size={18} 
              color={activeTab === 'history' 
                ? (isDark ? '#fff' : '#1a2a6c') 
                : (isDark ? '#888' : '#888')
              } 
            />
            <Text 
              style={[
                styles.tabText, 
                activeTab === 'history' && styles.activeTabText,
                isDark && styles.darkTabText,
                activeTab === 'history' && isDark && styles.darkActiveTabText
              ]}
            >
              Try-On History
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Content based on active tab */}
        <View style={styles.tabContent}>
          {activeTab === 'wishlist' && (
            wishlist.length > 0 ? (
              <FlatList
                data={wishlist}
                keyExtractor={(item) => item.id}
                renderItem={renderWishlistItem}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <EmptyListComponent type="wishlist" />
            )
          )}
          
          {activeTab === 'history' && (
            history.length > 0 ? (
              <FlatList
                data={history}
                keyExtractor={(item, index) => item.id + index}
                renderItem={renderHistoryItem}
                scrollEnabled={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <EmptyListComponent type="history" />
            )
          )}
        </View>
      </AnimatedScrollView>
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
  scrollContent: {
    paddingBottom: 40,
  },
  profileCard: {
    marginHorizontal: 16,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  darkProfileCard: {
    shadowOpacity: 0.2,
  },
  profileCardGradient: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: 'rgba(26, 42, 108, 0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  editText: {
    color: '#1a2a6c',
    fontWeight: '600',
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  darkStatCard: {
    backgroundColor: '#1e1e1e',
    shadowOpacity: 0.2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    padding: 4,
  },
  darkTab: {
    backgroundColor: '#2a2a2a',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  activeTab: {
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  darkActiveTab: {
    backgroundColor: '#333',
  },
  tabText: {
    marginLeft: 6,
    fontWeight: '500',
    color: '#888',
  },
  activeTabText: {
    color: '#1a2a6c',
    fontWeight: '600',
  },
  darkTabText: {
    color: '#888',
  },
  darkActiveTabText: {
    color: '#fff',
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    width: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyBtnGradient: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  emptyBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  darkText: {
    color: '#fff',
  },
  darkSubText: {
    color: '#aaa',
  },
});

export default ProfileScreen;