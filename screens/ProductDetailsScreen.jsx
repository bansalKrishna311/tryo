import React from 'react';
import { View, Text, Image, StyleSheet, Button } from 'react-native';

const ProductDetailsScreen = ({ route, navigation }) => {
  const { product } = route.params;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
      <Button title="Try It On" onPress={() => navigation.navigate('TryOn', { product })} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10
  },
  price: {
    fontSize: 20,
    color: '#888',
    marginBottom: 20
  }
});

export default ProductDetailsScreen;
