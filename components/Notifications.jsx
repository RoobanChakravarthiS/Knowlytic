import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import LottieView from 'lottie-react-native';

const NotificationPage = ({userId,navigation}) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverURL = 'http://10.21.96.34:5000';

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`${serverURL}/notifications`);
        setNotifications(response.data); // Directly use response.data
        
        console.log(notifications + 'hi');
      } catch (err) {
        setError('Failed to load notifications' + err.message);
        console.error('Error fetching notifications:', err);
      } finally {
        setTimeout(()=>setLoading(false),500)
        
      }
    };

    fetchNotifications();
  }, [userId]);

  const renderNotification = ({item}) => (
    <View style={styles.notificationCard}>
      <Text style={styles.notificationTitle}>{item.name}</Text>
      <Text style={styles.notificationDescription}>{item.message}</Text>
      <Text style={styles.notificationTime}>{item.createdAt}</Text>
      <TouchableOpacity onPress={()=>navigation.navigate('profileShare',item.userId)} style={styles.viewProfile}><Text style={styles.viewText}>View Profile</Text></TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView source={require('../assets/work.json')} autoPlay loop style={{height:400,width:400}}></LottieView>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        renderItem={renderNotification}
        keyExtractor={item => item.userId} // Ensure keyExtractor works with numbers
        contentContainerStyle={styles.notificationList}
      />
    </View>
  );
};

export default NotificationPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // Light gray background
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000', // Black color for the header text
    marginBottom: 20,
    textAlign: 'center',
  },
  notificationList: {
    paddingBottom: 20,
  },
  notificationCard: {
    backgroundColor: '#007BFF', // Blue background for the notification card
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000', // Black shadow for depth
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Adds depth on Android
  },
  notificationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff', // White text for the title
  },
  notificationDescription: {
    fontSize: 14,
    color: '#f0f0f0', // Slightly off-white color for the description
    marginTop: 5,
  },
  notificationTime: {
    fontSize: 12,
    color: '#D3D3D3', // Light gray color for time
    marginTop: 10,
    textAlign: 'right',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  viewProfile:{
    width:'80%',
    backgroundColor:'#fff',
    alignSelf:'center',
    height:35,
    alignItems:'center',
    marginTop:10,
    borderRadius:6,
    // justifyContent11111
    justifyContent:'center',

  },
  viewText:{
    color:'#000',
    fontWeight:'bold',
    fontSize:16,
  }
});
