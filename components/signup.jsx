import React, { useState } from "react";
import { TouchableHighlight, Animated, ActivityIndicator } from "react-native";
import { Text, View, TextInput, StyleSheet, Platform } from "react-native";
import { useForm, Controller } from 'react-hook-form';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const Signup = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors }, reset } = useForm();
  const [isPressed, setIsPressed] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));
  const [isLoading, setIsLoading] = useState(false); // New state for loading indicator

  const handlePressIn = () => {
    setIsPressed(true);
    Animated.spring(scaleValue, {
      toValue: 0.95,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    setIsPressed(false);
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  };

  const onSubmit = async (data) => {
    setIsLoading(true); // Show loading indicator
    try {
      const response = await axios.post('http://10.21.96.34:5000/signup', {
        name: data.name,
        schoolCode: data.schoolCode,
        password: data.password,
        number: data.mobile,
      });

      if (response.status === 201) {
        Toast.show({
          type: 'success',
          text1: 'Signup Successful',
          text2: 'Redirecting to login...',
        });

        setTimeout(() => {
          navigation.navigate('Login');
        }, 2000); // Delay before navigating to Login
        reset(); // Reset the form fields
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Signup Failed',
        text2: error.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };
  const toastConfig = {
    success: (internalState) => (
        <View style={styles.toastSuccess}>
            <Text style={styles.toastText}>{internalState.text1}</Text>
            <Text style={styles.toastSubText}>{internalState.text2}</Text>
        </View>
    ),
    error: (internalState) => (
        <View style={styles.toastError}>
            <Text style={styles.toastText}>{internalState.text1}</Text>
            <Text style={styles.toastSubText}>{internalState.text2}</Text>
        </View>
    ),
};


  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Sign Up</Text>

        <Controller
          control={control}
          name="name"
          rules={{ required: 'Name is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.name && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Name"
              placeholderTextColor="#888"
            />
          )}
        />
        {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}

        <Controller
          control={control}
          name="schoolCode"
          rules={{ required: 'School Code is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.schoolCode && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="School Code"
              placeholderTextColor="#888"
            />
          )}
        />
        {errors.schoolCode && <Text style={styles.errorText}>{errors.schoolCode.message}</Text>}

        <Controller
          control={control}
          name="password"
          rules={{ required: 'Password is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Password"
              secureTextEntry
              placeholderTextColor="#888"
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <Controller
          control={control}
          name="mobile"
          rules={{ required: 'Mobile Number is required' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.mobile && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Mobile Number"
              keyboardType="numeric"
              placeholderTextColor="#888"
            />
          )}
        />
        {errors.mobile && <Text style={styles.errorText}>{errors.mobile.message}</Text>}

        <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
          <TouchableHighlight
            style={[styles.button, { backgroundColor: isPressed ? '#b390eb' : '#3b82f6' }]}
            underlayColor="#8c62cd"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? ( // Show loading indicator if request is in progress
              <ActivityIndicator color="white" />
            ) : (
              <Text style={[styles.buttonText, { color: isPressed ? 'white' : '#ffffff' }]}>
                SIGN UP
              </Text>
            )}
          </TouchableHighlight>
        </Animated.View>

        <View style={styles.signIn}>
          <Text style={styles.signUpText}>
            Already have an account?{' '}
            <Text onPress={() => navigation.navigate('Login')} style={styles.linkText}>
              Sign In
            </Text>
          </Text>
        </View>
      </View>

      {/* Toast component to display the notifications */}
      <Toast  config={toastConfig} ref={(ref) => Toast.setRef(ref)}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Light gray background
    padding: 20,
  },
  formContainer: {
    width: '85%',
    paddingHorizontal: 30,
    paddingVertical: 20,
    backgroundColor: '#ffffff', // White for form container
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderColor: '#3b82f6', // Blue border for the form
    borderWidth: 1,
  },
  title: {
    fontSize: 34,
    color: '#1a202c', // Black for title
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  input: {
    width: '100%',
    padding: 10,
    fontSize: 18,
    borderRadius: 12,
    backgroundColor: '#f0f4f8', // Light gray for input background
    color: '#1a202c', // Dark text color
    marginBottom: 16,
    borderColor: '#3b82f6', // Blue border for input fields
    borderWidth: 1,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
    }),
  },
  inputError: {
    borderColor: 'red', // Red for input errors
    borderWidth: 1,
  },
  errorText: {
    color: 'red', // Red error text
    paddingLeft: 8,
    // paddingTop: 4,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
    }),
  },
  button: {
    padding: 16,
    borderRadius: 20,
    alignItems: 'center',
    backgroundColor: '#3b82f6', // Blue button
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 20,
    color: '#ffffff', // White text on button
    fontWeight: '600',
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
    }),
  },
  signIn: {
    paddingTop: 25,
    fontSize: 16,
  },
  signUpText: {
    fontSize: 14,
    color: '#3b82f6', // Blue text for sign-in message
    textAlign: 'center',
    fontStyle: 'italic',
  },
  linkText: {
    color: '#1a202c', // Darker black color for link text
    fontWeight: 'bold',
    fontStyle: 'normal',
  },
  toastSuccess: {
    backgroundColor: '#4CAF50', // Green for success toast
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  toastError: {
    backgroundColor: '#F44336', // Red for error toast
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  toastText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toastSubText: {
    color: 'white',
    fontSize: 14,
  },
});

export default Signup