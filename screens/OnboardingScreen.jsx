// OnboardingScreen.js
import React, { useRef } from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    key: '1',
    title: 'Welcome to TryItApp',
    text: 'Try before you buy – fashion made fun!',
    image: require('../assets/slide1.jpeg'),
    backgroundColor: '#B4D4FF',
  },
  {
    key: '2',
    title: 'Virtual Try-On',
    text: 'Upload a photo and simulate the fit with our advanced AR technology.',
    image: require('../assets/slide2.jpeg'),
    backgroundColor: '#B4D4FF',
  },
  {
    key: '3',
    title: 'Wishlist & History',
    text: 'Track what you loved and tried for easy access later.',
    image: require('../assets/slide3.jpeg'),
    backgroundColor: '#C8E4B2',
  },
];

const OnboardingScreen = ({ onFinish }) => {
  const sliderRef = useRef(null);

  const handleDone = async () => {
    try {
      await AsyncStorage.setItem('@viewedOnboarding', 'true');
      onFinish(); // Notify parent to switch to Home
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <SafeAreaView style={[styles.slide, { backgroundColor: item.backgroundColor }]}>
        <View style={styles.imageContainer}>
          <Image
            source={item.image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.text}</Text>
        </View>
      </SafeAreaView>
    );
  };

  const renderNextButton = () => (
    <View style={styles.buttonContainer}>
      <Text style={styles.buttonText}>Next</Text>
    </View>
  );

  const renderSkipButton = () => (
    <View style={styles.skipButtonContainer}>
      <Text style={styles.skipButtonText}>Skip</Text>
    </View>
  );

  const renderDoneButton = () => (
    <View style={styles.doneButtonContainer}>
      <Text style={styles.doneButtonText}>Get Started</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <AppIntroSlider
        ref={sliderRef}
        data={slides}
        renderItem={renderItem}
        onDone={handleDone}
        onSkip={handleDone}
        showSkipButton
        renderNextButton={renderNextButton}
        renderDoneButton={renderDoneButton}
        renderSkipButton={renderSkipButton}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    width: width,
    height: height * 0.5,
    overflow: 'hidden',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    marginTop: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
    color: '#555',
    lineHeight: 24,
  },
  buttonContainer: {
    width: 100,
    height: 44,
    backgroundColor: '#333',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  skipButtonContainer: {
    width: 80,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
  doneButtonContainer: {
    width: 150,
    height: 44,
    backgroundColor: '#FF6A88',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dotStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  activeDotStyle: {
    backgroundColor: '#FF6A88',
    width: 20,
    height: 8,
    borderRadius: 4,
  },
});

export default OnboardingScreen;
