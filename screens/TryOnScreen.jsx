import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary } from 'react-native-image-picker';
import Animated, { FadeInDown } from 'react-native-reanimated';

const TryOnScreen = ({ route }) => {
  const { product } = route.params;
  const [userPhoto, setUserPhoto] = useState(null);

  const pickImage = () => {
    launchImageLibrary({}, response => {
      if (response.assets && response.assets.length > 0) {
        setUserPhoto(response.assets[0].uri);
      }
    });
  };

  useEffect(() => {
    const addToHistory = async () => {
      const stored = await AsyncStorage.getItem('tryHistory');
      const history = stored ? JSON.parse(stored) : [];
      history.unshift(product);
      await AsyncStorage.setItem('tryHistory', JSON.stringify(history.slice(0, 5)));
    };
    addToHistory();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Animated.Text entering={FadeInDown.delay(100)} style={styles.title}>
        Try-On Simulation
      </Animated.Text>

      <Animated.Image
        entering={FadeInDown.delay(200)}
        source={{ uri: product.image }}
        style={styles.tryOnImage}
      />

      <Animated.Text entering={FadeInDown.delay(300)} style={styles.caption}>
        Mock try-on for: {product.name}
      </Animated.Text>

      <Animated.View entering={FadeInDown.delay(400)}>
        <TouchableOpacity onPress={pickImage} style={styles.uploadButton}>
          <Text style={styles.uploadText}>📷 Upload Your Photo</Text>
        </TouchableOpacity>
      </Animated.View>

      {userPhoto && (
        <Animated.Image
          entering={FadeInDown.delay(500)}
          source={{ uri: userPhoto }}
          style={styles.userPhoto}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111',
    flexGrow: 1,
    alignItems: 'center',
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
  },
  tryOnImage: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 16,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  caption: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111',
  },
  userPhoto: {
    width: 250,
    height: 250,
    borderRadius: 16,
    marginTop: 30,
    resizeMode: 'cover',
    borderColor: '#fff',
    borderWidth: 2,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
});

export default TryOnScreen;
