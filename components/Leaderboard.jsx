import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import LottieView from 'lottie-react-native';
import trophyAnimation from '../assets/trophy.json';

const leaderboardData = [
  { rank: 1, name: 'Alice Johnson', class: 'Grade 12', points: 95 },
  { rank: 2, name: 'David Smith', class: 'Grade 10', points: 90 },
  { rank: 3, name: 'Michael Brown', class: 'Grade 8', points: 85 },
  { rank: 4, name: 'Jennifer Lee', class: 'Grade 9', points: 80 },
  { rank: 5, name: 'Thomas Wilson', class: 'Grade 11', points: 75 },
  { rank: 6, name: 'Emily Davis', class: 'Grade 7', points: 70 },
  { rank: 7, name: 'Chris Evans', class: 'Grade 6', points: 68 },
  { rank: 8, name: 'Katie Taylor', class: 'Grade 5', points: 65 },
  { rank: 9, name: 'Daniel Craig', class: 'Grade 4', points: 60 },
  { rank: 10, name: 'Sophia Turner', class: 'Grade 3', points: 55 },
];

const LeaderboardScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const renderLeaderboardItem = ({ item }) => {
    const rankColor =
      item.rank === 1 ? '#FFD700' : item.rank === 2 ? '#C0C0C0' : item.rank === 3 ? '#cd7f32' : '#B899E5';

    return (
      <View style={[styles.leaderboardCard, { borderColor: rankColor }]}>
        <View style={styles.rankContainer}>
          <Text style={[styles.rank, { color: rankColor }]}>#{item.rank}</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.class}>Class: {item.class}</Text>
          <Text style={styles.points}>Points: {item.points}</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Lottie Animation Container */}
      <View style={styles.lottieContainer}>
        <LottieView
          source={trophyAnimation}
          autoPlay
          loop
          style={styles.trophyAnimation}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Teacher Leaderboard</Text>

      {/* Rank List Container */}
      <View style={styles.rankListContainer}>
        <FlatList
          data={leaderboardData.slice(0, 5)} // Display top 5 only
          renderItem={renderLeaderboardItem}
          keyExtractor={(item) => item.rank.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Modal Button */}
      <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.modalButtonText}>Show Full Leaderboard</Text>
      </TouchableOpacity>

      {/* Modal for Full Leaderboard */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Full Leaderboard</Text>
            <ScrollView>
              <FlatList
                data={leaderboardData}
                renderItem={renderLeaderboardItem}
                keyExtractor={(item) => item.rank.toString()}
                contentContainerStyle={styles.listContainer}
              />
            </ScrollView>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default LeaderboardScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Allow the ScrollView to grow with its content
    backgroundColor: '#f0f4f8', // Light gray background
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    color: '#4b5563', // Darker shade for the title
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  lottieContainer: {
    width: '100%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background for Lottie container
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  trophyAnimation: {
    width: 150,
    height: 150,
  },
  rankListContainer: {
    width: '100%',
    paddingBottom: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff', // White background for the leaderboard
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  listContainer: {
    width: '100%',
    alignItems: 'center',
  },
  leaderboardCard: {
    width: '90%',
    minHeight: 80, // Increased minimum height for better visibility
    backgroundColor: '#ffffff', // White background for each card
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f3e5f5', // Light background for the rank circle
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 5,
  },
  rank: {
    fontSize: 24, // Increased font size for better visibility
    fontWeight: 'bold',
  },
  detailsContainer: {
    flex: 1,
    marginLeft: 20,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    color: '#4b5563', // Darker shade for name
    fontWeight: '600',
  },
  class: {
    fontSize: 18,
    color: '#6b7280', // Gray for class
  },
  points: {
    fontSize: 18,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#3b82f6', // Primary button color
    padding: 12,
    borderRadius: 5,
    marginTop: 20,
    width: '80%', // Button width
    alignItems: 'center',
    marginBottom: 20, // Space below the button
  },
  modalButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 50, // Semi-transparent background
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#ffffff', // Background for modal content
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: '#f44336', // Close button color
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});
