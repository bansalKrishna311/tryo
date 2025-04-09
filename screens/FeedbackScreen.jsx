import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'react-native-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeIn,
  SlideInUp,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import AnimatedHeader from '../components/AnimatedHeader';

const FeedbackTypes = [
  { id: 'general', icon: 'chatbubble-outline', label: 'General' },
  { id: 'product', icon: 'cube-outline', label: 'Product' },
  { id: 'shipping', icon: 'car-outline', label: 'Shipping' },
  { id: 'technical', icon: 'code-slash-outline', label: 'Technical' }
];

const FeedbackScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selectedType, setSelectedType] = useState('general');
  const [satisfied, setSatisfied] = useState(null);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const handleSubmit = () => {
    if (!name || !email || !feedback || satisfied === null) {
      Alert.alert('Missing Information', 'Please complete all fields before submitting.');
      return;
    }

    console.log('📩 Feedback Submitted:', { 
      name, 
      email, 
      feedback, 
      type: selectedType,
      satisfaction: satisfied ? 'Satisfied' : 'Unsatisfied'
    });
    
    Alert.alert(
      'Thank You!', 
      'We appreciate your feedback and will use it to improve our services.',
      [{ text: 'OK', onPress: resetForm }]
    );
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setFeedback('');
    setSelectedType('general');
    setSatisfied(null);
  };

  const renderSatisfactionOptions = () => (
    <View style={styles.satisfactionContainer}>
      <Text style={styles.sectionLabel}>Are you satisfied with our service?</Text>
      
      <View style={styles.satisfactionOptions}>
        <TouchableOpacity
          style={[
            styles.satisfactionOption,
            satisfied === true && styles.selectedSatisfactionOption
          ]}
          onPress={() => setSatisfied(true)}
        >
          <Icon 
            name={satisfied === true ? "happy" : "happy-outline"} 
            size={28} 
            color={satisfied === true ? "#1a2a6c" : "#777"} 
          />
          <Text style={[
            styles.satisfactionText,
            satisfied === true && styles.selectedSatisfactionText
          ]}>Yes</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.satisfactionOption,
            satisfied === false && styles.selectedSatisfactionOption
          ]}
          onPress={() => setSatisfied(false)}
        >
          <Icon 
            name={satisfied === false ? "sad" : "sad-outline"} 
            size={28} 
            color={satisfied === false ? "#b21f1f" : "#777"} 
          />
          <Text style={[
            styles.satisfactionText,
            satisfied === false && styles.selectedSatisfactionText
          ]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <AnimatedHeader 
        scrollY={scrollY} 
        navigation={navigation}
        title="Feedback"
        subtitle="Help us improve"
        showBackButton={true}
        rightIcons={['help-circle-outline']}
        rightScreens={['Help']}
      />

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      >
        <Animated.View entering={FadeIn.delay(200).duration(400)}>
          <View style={styles.introContainer}>
            <Image 
              source={require('../assets/feedback-illustration.png')} 
              style={styles.illustration}
              {...(Platform.OS === 'ios' && { defaultSource: require('../assets/feedback-illustration.png') })}
            />
            <Text style={styles.introText}>
              We value your opinion! Your feedback helps us improve our products and services.
            </Text>
          </View>

          <View style={styles.formSection}>
            <Text style={styles.sectionLabel}>Feedback Type</Text>
            <View style={styles.feedbackTypes}>
              {FeedbackTypes.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeOption,
                    selectedType === type.id && styles.selectedTypeOption
                  ]}
                  onPress={() => setSelectedType(type.id)}
                >
                  <Icon 
                    name={type.icon} 
                    size={20} 
                    color={selectedType === type.id ? '#fff' : '#555'} 
                  />
                  <Text style={[
                    styles.typeLabel,
                    selectedType === type.id && styles.selectedTypeLabel
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Animated.View 
            entering={SlideInUp.delay(300).springify()} 
            style={styles.formContainer}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <Icon name="person-outline" size={18} color="#777" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your name"
                  value={name}
                  onChangeText={setName}
                  style={styles.input}
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Icon name="mail-outline" size={18} color="#777" style={styles.inputIcon} />
                <TextInput
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {renderSatisfactionOptions()}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Your Feedback</Text>
              <View style={[styles.inputWrapper, styles.textAreaWrapper]}>
                <TextInput
                  placeholder="Please share your thoughts, suggestions or issues..."
                  value={feedback}
                  onChangeText={setFeedback}
                  style={[styles.input, styles.textArea]}
                  placeholderTextColor="#999"
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
            </View>

            <LinearGradient
              colors={['#1a2a6c', '#b21f1f', '#fdbb2d']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButtonContainer}
            >
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
                <Icon name="send" size={18} color="#fff" style={styles.submitIcon} />
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </Animated.ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 130,
    paddingBottom: 40,
  },
  introContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  illustration: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  introText: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  feedbackTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  typeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
    width: '48%',
    borderWidth: 1,
    borderColor: '#eee',
  },
  selectedTypeOption: {
    backgroundColor: '#1a2a6c',
    borderColor: '#1a2a6c',
  },
  typeLabel: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
  },
  selectedTypeLabel: {
    color: '#fff',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    marginTop: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  inputGroup: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
  },
  textAreaWrapper: {
    alignItems: 'flex-start',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  satisfactionContainer: {
    marginBottom: 18,
  },
  satisfactionOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  satisfactionOption: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
    paddingVertical: 12,
  },
  selectedSatisfactionOption: {
    backgroundColor: '#f0f7ff',
    borderColor: '#1a2a6c',
  },
  satisfactionText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#555',
  },
  selectedSatisfactionText: {
    color: '#1a2a6c',
    fontWeight: '500',
  },
  submitButtonContainer: {
    borderRadius: 12,
    marginTop: 10,
    overflow: 'hidden',
  },
  submitButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  submitIcon: {
    marginLeft: 8,
  },
});

export default FeedbackScreen;
