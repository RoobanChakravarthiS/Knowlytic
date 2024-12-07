import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  Share
} from 'react-native';

import Pdf from 'react-native-pdf'; // Import PDF viewer
import likeIcon from '../assets/like.png';
import commentIcon from '../assets/comment.png';
import profilePlaceholder from '../assets/Profile.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const ProfileShare = ({ route }) => {
  const userId = route.params;
  const [details, setDetails] = useState({});
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false); // State for PDF modal
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comment, setComment] = useState('');
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverURL = 'http://10.21.96.34:5000';
  const [selectedPostId, setSelectedPostId] = useState(null);

  useFocusEffect(
    useCallback(() => {
      const getUserId = async () => {
        try {
          if (userId !== null) {
            await fetchUserDetails(userId); // Fetch user details with the user ID
          }
        } catch (error) {
          console.error('Failed to retrieve user ID', error);
        }
        setTimeout(()=>{setLoading(false)},1500)
      };

      const fetchUserDetails = async (userId) => {
        try {
          const response = await axios.get(`${serverURL}/user/${userId}`);
          if (response.status === 200) {
            setDetails(response.data);
            const imagePath = `/${response.data.profileImage}`;
            const imageURI = `${serverURL}${imagePath}`;
            setProfileImageUri(imageURI);
            setPosts(response.data.posts.reverse());
          }
        } catch (error) {
          setError(
            error.response?.data?.message || 'Error fetching user details',
          );
          console.error('Error fetching user details', error);
        } finally {
          setLoading(false);
        }
      };

      getUserId();
    }, [])
  );

  const handleLike = async (postId) => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await axios.post(`${serverURL}/posts/${postId}/like`, {
        userId: userId,
      });

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === postId ? { ...post, likes: response.data.likes } : post,
        ),
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (!selectedPostId) return; // Ensure we have a selected post

    const userId = await AsyncStorage.getItem('userId');

    try {
      const res = await axios.post(
        `${serverURL}/posts/${selectedPostId}/comment`,
        {
          userId: userId,
          comment: comment,
        },
      );
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post._id === selectedPostId
            ? { ...post, comments: response.data.comments }
            : post,
        ),
      );
      setComment(''); // Clear the comment field
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      closeCommentModal(); // Close the modal after adding the comment
    }
  };

  const handleViewPdf = (uri) => {
    setPdfUri(uri); // Set the selected PDF URI
    setPdfModalVisible(true); // Open the PDF viewer modal
  };

  const openCommentModal = (postId) => {
    setCommentModalVisible(true);
    setSelectedPostId(postId);
  };

  const shareProfile = async () => {
    try {
      const shareMessage = `
        Check out ${details.name}'s profile!
        Email: ${details.email}
        Phone: ${details.phone}
        Total Points: ${details.points}
        Profile URL: ${serverURL}/user/${userId}
      `;
      await Share.share({
        message: shareMessage,
      });
    } catch (error) {
      console.error('Error sharing profile:', error);
    }
  };

  

  return (
    <View style={styles.container}>
    {loading ?(<LottieView 
        source={require('../assets/car.json')}
        autoPlay
        loop
        style={{
          width: 200,
          height: 200,
          
        }}
        ></LottieView>):
        <><View style={styles.details}>
        <View style={styles.profileContainer}>
          <Image
            source={profileImageUri ? { uri: profileImageUri } : profilePlaceholder}
            style={styles.profileImage}
          />
          <View style={styles.personal}>
            <Text style={styles.detailText}>Name: {details.name}</Text>
            <Text style={styles.detailText}>Position: Teacher</Text>
            <Text style={styles.detailText}>School Code: {details.schoolCode}</Text>
            <Text style={styles.detailText}>Email: {details.email}</Text>
            <Text style={styles.detailText}>Phone: {details.phone}</Text>
            <Text style={styles.totalPoints}>Total Points: {details.points}</Text>
          </View>
        </View>
          <TouchableOpacity onPress={shareProfile} style={styles.pdfButton}>
                <Text style={styles.shareButtonText}>Share Profile</Text>
              </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <FlatList
          data={posts}
          renderItem={({ item }) => (
            <View key={item._id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Image
                  source={{ uri: `${serverURL}/${item.profile}` }}
                  style={styles.profileImage}
                />
                <View style={styles.postInfo}>
                  <Text style={styles.username}>{item.name}</Text>
                  <Text style={styles.timestamp}>
                    {new Date(item.date).toLocaleTimeString()}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.moreOptions}>⋮</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.postContent}>{item.title}</Text>
              <Text style={styles.postContent}>{item.description}</Text>
              {item.imageUri && (
                <Image
                  source={{ uri: `${serverURL}/${item.imageUri}` }}
                  style={styles.postImage}
                />
              )}
              {item.pdfUri && (
                <TouchableOpacity
                  style={styles.pdfButton}
                  onPress={() => handleViewPdf(`${serverURL}/${item.pdfUri}`)}>
                  <Text style={styles.pdfButtonText}>View PDF</Text>
                </TouchableOpacity>
              )}
              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(item._id)}>
                  <Image source={likeIcon} style={styles.icon} />
                  <Text style={styles.actionText}>{item.likes?.length || 0} Likes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openCommentModal(item._id)}>
                  <Image source={commentIcon} style={styles.icon} />
                  <Text style={styles.actionText}>{item.comments.length} Comments</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.commentsSection}>
                {item.comments.length > 0 ? (
                  item.comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                      <Text style={styles.commentUsername}>{comment.userId}</Text>
                      <Text style={styles.commentText}>{comment.comment}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noComments}>No comments yet.</Text>
                )}
              </View>
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </ScrollView></>}
      

      {/* Modal for comments */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModalVisible}
        onRequestClose={() => setCommentModalVisible(false)}>
        <View style={styles.modalView}>
          <TextInput
            placeholder="Comment"
            value={comment}
            onChangeText={(text) => setComment(text)}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleComment}>
            <Text style={styles.submitButtonText}>Submit Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setCommentModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Modal for PDF viewer */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pdfModalVisible}
        onRequestClose={() => setPdfModalVisible(false)}>
        <View style={styles.modalView}>
          <Pdf
            source={{ uri: pdfUri, cache: true }}
            style={styles.pdf}
          />
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setPdfModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close PDF</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Loading and Error handling */}
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
    padding: 20,
    justifyContent:'center',
  },
  details: {
    marginBottom: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 12,
    padding: 15,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  personal: {
    flex: 1,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
  },
  totalPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#007bff',
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  postCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    elevation: 5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postInfo: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  moreOptions: {
    fontSize: 18,
    color: '#007bff',
  },
  postContent: {
    fontSize: 14,
    color: '#444',
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
  },
  pdfButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 15,
    marginBottom: 10,
    marginTop:10,
    elevation:10,
    shadowColor:'#000'
  },
  pdfButtonText: {
    color: '#ffffff',
    textAlign: 'center',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  actionText: {
    fontSize: 14,
    color: '#007bff',
  },
  commentsSection: {
    marginTop: 10,
  },
  comment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  commentUsername: {
    fontWeight: 'bold',
    color: '#007bff',
  },
  commentText: {
    color: '#444',
    flex: 1,
    marginLeft: 10,
  },
  noComments: {
    fontStyle: 'italic',
    color: '#666',
  },
  modalView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '80%',
    marginBottom: 10,
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#ffffff',
  },
  closeButton: {
    backgroundColor: '#dc3545',
    borderRadius: 5,
    padding: 10,
    width: '80%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff',
  },
  loadingText: {
    color: '#007bff',
    textAlign: 'center',
    marginTop: 20,
  },
  errorText: {
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 20,
  },
  pdf: {
    width: '100%',
    height: '100%',
  },
});

export default ProfileShare;
