import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Login from './components/login';
import Signup from './components/signup';
import BottomTab from './components/BottomTab';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import GS from './components/GS';
import DBLP from './components/DBLP';
import Post from './components/Post';
import NotificationPage from './components/Notifications';
import ProfileShare from './components/profileShare';

const Stack = createNativeStackNavigator();

const App = () => {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
        <Stack.Screen name='Signup' component={Signup} options={{ headerShown: false }} />
        <Stack.Screen name='Home' component={BottomTab} options={{ headerShown: false }} />
        <Stack.Screen name='GS' component={GS} options={{headerShown:false}}/>
        <Stack.Screen name='DBLP' component={DBLP} options={{headerShown:false}}/>
        <Stack.Screen name='post' component={Post} options={{headerShown:false}}/>
        <Stack.Screen name='notification' component={NotificationPage} options={{headerShown:false}}/>
        <Stack.Screen name='profileShare' component={ProfileShare} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({});
