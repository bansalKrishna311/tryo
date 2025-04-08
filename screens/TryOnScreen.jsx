import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const TryOnScreen = ({ route }) => {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Try-On Simulation</Text>
      <Image source={{ uri: product.image }} style={styles.tryOnImage} />
      <Text style={styles.caption}>Mock try-on for: {product.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 20
  },
  tryOnImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 4,
    borderColor: '#fff'
  },
  caption: {
    color: '#ccc',
    marginTop: 16,
    fontSize: 16
  }
});

export default TryOnScreen;
