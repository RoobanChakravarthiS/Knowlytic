import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import profile from '../assets/Profile.png';
import profileuf from '../assets/Profileuf.png';
import Chat from '../assets/Chat.png';
import Chatuf from '../assets/Chatuf.png';
import leaderboard from '../assets/podium.png';
import leaderboarduf from '../assets/podiumuf.png';
import achievements from '../assets/badge.png';
import Achievementsuf from '../assets/medal-.png';
import Profile from './Profile';
import Community from './Community';
import Leaderboard from './Leaderboard';
import Achievements from './Achievements';
import SocialMediaFeed from './Feed';
import notificationIcon from '../assets/notification.png';

const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }) => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarLabel: ({ focused }) => {
          let label;
          if (route.name === 'Profile') label = 'Me';
          if (route.name === 'LeaderBoard') label = 'Leaderboard';
          if (route.name === 'Achievements') label = 'Achievement';
          if (route.name === 'Chat') label = 'Community';

          return (
            <Text style={[styles.tabBarLabel, focused && styles.activeLabel]}>
              {label}
            </Text>
          );
        },
        tabBarIcon: ({ focused }) => {
          let icon;
          if (route.name === 'Profile') icon = focused ? profileuf : profile;
          if (route.name === 'LeaderBoard') icon = focused ? leaderboarduf : leaderboard;
          if (route.name === 'Achievements') icon = focused ? Achievementsuf : achievements;
          if (route.name === 'Chat') icon = focused ? Chat : Chatuf;

          return (
            <View style={styles.iconContainer}>
              <Image
                source={icon}
                style={[
                  styles.tabBarIcon,
                  focused ? styles.activeIcon : styles.inactiveIcon,
                ]}
              />
            </View>
          );
        },
        tabBarStyle: styles.tabBarStyle,
        tabBarActiveTintColor: '#007BFF',
        tabBarInactiveTintColor: '#9CA3AF',
      })}
    >
      <Tab.Screen
        component={Profile}
        name="Profile"
        options={commonHeaderOptions(navigation)}
      />
      <Tab.Screen
        component={SocialMediaFeed}
        name="Chat"
        options={commonHeaderOptions(navigation)}
      />
      <Tab.Screen
        component={Leaderboard}
        name="LeaderBoard"
        options={commonHeaderOptions(navigation)}
      />
      <Tab.Screen
        component={Achievements}
        name="Achievements"
        options={commonHeaderOptions(navigation)}
      />
    </Tab.Navigator>
  );
};

const commonHeaderOptions = (navigation) => ({
  title: 'Knowlytic',
  headerTitleAlign: 'center',
  headerRight: () => (
    <TouchableOpacity
      onPress={() => navigation.navigate('notification')}
      style={styles.headerRightContainer}
    >
      <Image source={notificationIcon} style={styles.notificationIcon} />
    </TouchableOpacity>
  ),
  headerStyle: styles.header,
  headerTitleStyle: styles.headerTitle,
});

export default BottomTab;

const styles = StyleSheet.create({
  notificationIcon: {
    width: 26,
    height: 26,
    tintColor: '#007BFF',
  },
  headerRightContainer: {
    marginRight: 15,
  },
  tabBarStyle: {
    backgroundColor: '#FFFFFF',
    height: 80, // Adjusted height for better touch area
    borderRadius: 30,
    position: 'absolute',
    bottom: 15,
    left: 10,
    right: 10,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    borderTopWidth: 0,
    paddingBottom: 10,
  },
  tabBarIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  activeIcon: {
    tintColor: '#FFFFFF',
    backgroundColor: '#007BFF',
    borderRadius: 30,
    padding: 10, // Slightly more padding for active state
    shadowColor: '#007BFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  inactiveIcon: {
    tintColor: '#ADB5BD',
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    color: '#ADB5BD',
    marginTop: 5,
  },
  activeLabel: {
    color: '#007BFF',
    fontSize: 12,
    fontWeight: '700',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#fff',
    height: 70,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007BFF',
    textAlign: 'center',
  },
});
