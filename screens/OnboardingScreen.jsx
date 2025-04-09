// OnboardingScreen.js
import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import { View, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const slides = [
  {
    key: '1',
    title: 'Welcome to TryItApp',
    text: 'Try before you buy – fashion made fun!',
    image: require('../assets/slide1.jpeg'),
  },
  {
    key: '2',
    title: 'Virtual Try-On',
    text: 'Upload a photo and simulate the fit.',
    image: require('../assets/slide2.jpeg'),
  },
  {
    key: '3',
    title: 'Wishlist & History',
    text: 'Track what you loved and tried.',
    image: require('../assets/slide3.jpeg'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const handleDone = async () => {
    try {
      await AsyncStorage.setItem('@viewedOnboarding', 'true');
      navigation.replace('Home'); // Navigate to the Home screen
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  return (
    <AppIntroSlider
      data={slides}
      renderItem={({ item }) => (
        <View style={styles.slide}>
          <Image source={item.image} style={styles.image} />
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      )}
      onDone={handleDone}
      showSkipButton={true}
      onSkip={handleDone}
    />
  );
};

const styles = StyleSheet.create({
  slide: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 20 },
  image: { width: 300, height: 300, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, textAlign: 'center', paddingHorizontal: 30 },
});

export default OnboardingScreen;