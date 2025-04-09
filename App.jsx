// App.jsx
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { LoadingProvider, useLoading } from './contexts/LoadingContext';
import OnboardingScreen from './screens/OnboardingScreen';
import HomeScreen from './screens/HomeScreen';
import ProductDetailsScreen from './screens/ProductDetailsScreen';
import TryOnScreen from './screens/TryOnScreen';
import ProfileScreen from './screens/ProfileScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import CartScreen from './screens/CartScreen';

const Stack = createNativeStackNavigator();

const AppContent = () => {
  const { loading } = useLoading();
  const [showOnboarding, setShowOnboarding] = useState(null);

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('@viewedOnboarding');
      setShowOnboarding(value === null);
    } catch (error) {
      console.error('Error checking onboarding:', error);
      setShowOnboarding(true);
    }
  };

  if (showOnboarding === null) return null;

  return (
    <>
      <Spinner
        visible={loading}
        textContent="Loading..."
        textStyle={{ color: '#fff' }}
      />
      <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
  {showOnboarding ? (
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
  ) : (
    <>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={ProductDetailsScreen} />
      <Stack.Screen name="TryOn" component={TryOnScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </>
  )}
</Stack.Navigator>

      </NavigationContainer>
    </>
  );
};

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <LoadingProvider>
      <AppContent />
    </LoadingProvider>
  </GestureHandlerRootView>
);

export default App;