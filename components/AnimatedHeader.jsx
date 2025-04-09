import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Animated, {
  interpolate,
  useAnimatedStyle,
  Extrapolation,
} from 'react-native-reanimated';

const AnimatedHeader = ({
  scrollY,
  navigation,
  height = 100,
  title = 'Discover',
  subtitle = 'Premium Products',
}) => {
  const iconAnimatedStyle = useAnimatedStyle(() => {
    const scale = interpolate(scrollY.value, [0, 100], [1, 0.85], Extrapolation.CLAMP);
    const opacity = interpolate(scrollY.value, [0, 100], [1, 0.5], Extrapolation.CLAMP);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <View style={[styles.header, { height }]}>
      <LinearGradient
        colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          <Animated.View style={[styles.iconsContainer, iconAnimatedStyle]}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Feedback')}
            >
              <Icon name="chatbubble-outline" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Icon name="cart-outline" size={22} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Icon name="person-outline" size={22} color="#FFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 2,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});

export default AnimatedHeader;
