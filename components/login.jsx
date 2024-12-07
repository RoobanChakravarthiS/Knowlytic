import React, {useState} from 'react';
import {TouchableHighlight, Animated} from 'react-native';
import {Text, View, TextInput, StyleSheet, Platform} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message'; // Import Toast

const Login = ({navigation}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();
  const [isPressed, setIsPressed] = useState(false);
  const [scaleValue] = useState(new Animated.Value(1));

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

  const onSubmit = async data => {
    try {
      const response = await axios.post('http://10.21.96.34:5000/login', {
        number: data.username, // Assuming you're using 'username' as the number
        password: data.password,
      });

      if (response.status === 200) {
        const userId = response.data.userId;
        console.log('Login successful', userId);

        await AsyncStorage.setItem('userId', userId);

        // Show toast for successful login
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'You will be redirected shortly...',
          position: 'top',
          visibilityTime: 2000,
          autoHide: true,
          topOffset: 30,
          props: {
            style: styles.toastSuccess,
            text1Style: styles.toastText,
            text2Style: styles.toastSubText,
          },
        });

        // Delay navigation by 2 seconds
        setTimeout(() => {
          navigation.navigate('Home');
        }, 1000);
      }
    } catch (error) {
      console.error(
        'Login failed',
        error.response?.data?.message || error.message,
      );
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.message || 'Please try again.',
        position: 'top',
        visibilityTime: 2000,
        autoHide: true,
        topOffset: 30,
        props: {
          style: styles.toastError,
          text1Style: styles.toastText,
          text2Style: styles.toastSubText,
        },
      });
    }
  };

  const toastConfig = {
    success: internalState => (
      <View style={styles.toastSuccess}>
        <Text style={styles.toastText}>{internalState.text1}</Text>
        <Text style={styles.toastSubText}>{internalState.text2}</Text>
      </View>
    ),
    error: internalState => (
      <View style={styles.toastError}>
        <Text style={styles.toastText}>{internalState.text1}</Text>
        <Text style={styles.toastSubText}>{internalState.text2}</Text>
      </View>
    ),
  };

  return (
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Login</Text>

        <Controller
          control={control}
          name="username"
          rules={{required: 'Mobile Number is required'}}
          render={({field: {onChange, onBlur, value}}) => (
            <TextInput
              style={[styles.input, errors.username && styles.inputError]}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              placeholder="Mobile Number"
              placeholderTextColor="#888" // Placeholder Gray
            />
          )}
        />
        {errors.username && (
          <Text style={styles.errorText}>{errors.username.message}</Text>
        )}

        <Controller
          control={control}
          name="password"
          rules={{required: 'Password is required'}}
          render={({field: {onChange, onBlur, value}}) => (
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
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        <Animated.View style={{transform: [{scale: scaleValue}]}}>
          <TouchableHighlight
            style={[
              styles.button,
              {backgroundColor: isPressed ? '#b390eb' : '#3b82f6'},
            ]}
            underlayColor="#3b82f6"
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleSubmit(onSubmit)}>
            <Text style={[styles.buttonText, {color: '#ffffff'}]}>LOGIN</Text>
          </TouchableHighlight>
        </Animated.View>

        <View style={styles.signIn}>
          <Text style={styles.forgotText}>New user? </Text>
          <Text
            onPress={() => navigation.navigate('Signup')}
            style={styles.signUpText}>
            Sign UP
          </Text>
        </View>
      </View>

      <Toast ref={ref => Toast.setRef(ref)} config={toastConfig}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Light Gray Background
    padding: 20,
  },
  formContainer: {
    width: '85%',
    padding: 30,
    backgroundColor: '#ffffff', // White form container background
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderColor: '#3b82f6', // Primary Blue border
    borderWidth: 1,
  },
  title: {
    fontSize: 34,
    color: '#1a202c', // Dark Text
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 1.5,
  },
  input: {
    width: '100%',
    // padding: 16,
    fontSize: 18,
    borderRadius: 12,
    backgroundColor: '#f0f4f8', // Light Gray input background
    color: '#1a202c', // Dark Text for input
    marginBottom: 16,
    borderColor: '#3b82f6', // Primary Blue input border
    borderWidth: 1,
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
    }),
  },
  inputError: {
    borderColor: 'red', // Error Red input border
    borderWidth: 1,
  },
  errorText: {
    color: 'red', // Error Red text
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
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff', // White button text
    fontFamily: Platform.select({
      ios: 'System',
      android: 'sans-serif',
    }),
  },
  signIn: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingTop: 25,
    fontSize: 16,
    gap: 8,
  },
  forgotText: {
    fontSize: 14,
    color: '#3b82f6', // Primary Blue for links
    fontStyle: 'italic',
  },
  signUpText: {
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

export default Login;
