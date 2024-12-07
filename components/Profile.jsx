import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import LottieView from 'lottie-react-native';
import boy from '../assets/boy.json';
import girl from '../assets/girl.json';
import loadingAnimation from '../assets/loading.json'; // Import your loading animation
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const Profile = ({ navigation }) => {
  const [name, setName] = useState('SaambuMavan'); 
  const [gender, setGender] = useState('Male'); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const date = new Date();
  const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;

  const handleReportGeneration = (reportType) => {
    navigation.navigate(reportType);
  };

  useEffect(() => {
    const getUserId = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId !== null) {
          await fetchUserDetails(userId); 
        }
      } catch (error) {
        console.error("Failed to retrieve user ID", error);
      }
    };

    const fetchUserDetails = async (userId) => {
      try {
        const response = await axios.get(`http://10.21.96.34:5000/user/${userId}`);
        if (response.status === 200) {
          const { name, gender } = response.data; 
          setName(name);
          setGender(gender);
        }
      } catch (error) {
        setError(error.response?.data?.message || "Error fetching user details");
        console.error("Error fetching user details", error);
      } finally {
        setTimeout(()=>{
          setLoading(false); 
        },1500)
      }
    };

    getUserId(); 
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LottieView
          source={loadingAnimation} // Use your loading animation
          autoPlay
          loop
          style={styles.loadingAnimation}
        />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    ); 
  }

  if (error) {
    return <Text style={{ color: 'red' }}>{error}</Text>; 
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.welcomeContainer}>
        <Text style={styles.welcomeText}>Welcome Back, {name}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
        <View style={styles.animation}>
          <LottieView
            source={gender === 'Male' ? boy : girl}
            loop
            autoPlay
            style={styles.lottie}
          />
        </View>
      </View>

      {/* Report Generation Cards */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.reportCard}
          onPress={() => handleReportGeneration('GS')}
        >
          <Text style={styles.cardTitle}>Generate Publication summary</Text>
          <Text style={styles.cardDescription}>From google via App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reportCard}
          onPress={() => handleReportGeneration('DBLP')}
        >
          <Text style={styles.cardTitle}>Generate files Report</Text>
          <Text style={styles.cardDescription}>via App</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{...styles.reportCard,alignItems:'center'}}
          // onPress={() => handleReportGeneration('post')}
        >
          <Text style={styles.cardTitle}>Learn more win more</Text>
          <Text style={styles.cardDescription}>Jai Hind</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#f0f4f8',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Same background as the main container
  },
  loadingAnimation: {
    width: 250,
    height: 250,
    marginBottom: 20, // Add some space between the animation and text
  },
  loadingText: {
    fontSize: 18,
    color: '#1e40af', // Blue for loading state
    textAlign: 'center',
  },
  welcomeContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
    marginBottom: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    textAlign: 'center',
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 15,
  },
  animation: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  lottie: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 120,
  },
  reportCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginVertical: 12,
    width: '90%',
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#2563eb',
    height: '20%',
    borderRightWidth:5,borderRightColor:'#2563eb'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e3a8a',
  },
  cardDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});
