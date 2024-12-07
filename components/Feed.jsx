import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import axios from 'axios';
import PDFReader from 'react-native-pdf';
import likeIcon from '../assets/like.png';
import commentIcon from '../assets/comment.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Pdf from 'react-native-pdf';
import LottieView from 'lottie-react-native';
import loadingAnimation from '../assets/loading.json'; 
import {useFocusEffect} from '@react-navigation/native';
const SocialMediaFeed = ({navigation}) => {
  const serverURL = 'http://10.21.96.34:5000';
  const [posts, setPosts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isCommentModalVisible, setisCommentModalVisible] = useState(false);
  const [selectedPdfUri, setSelectedPdfUri] = useState('');
  const [comment, setComment] = useState('');
  const [selectedPostId, setSelectedPostId] = useState(null); // State for the selected post ID
  const [loading, setLoading] = useState(true);

  const handleAddComment = async () => {
    if (!selectedPostId) return; // Ensure we have a selected post

    const userId = await AsyncStorage.getItem('userId');

    try {
      const response = await axios.post(
        `${serverURL}/posts/${selectedPostId}/comment`,
        {
          userId,
          comment,
        },
      );

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === selectedPostId
            ? {...post, comments: response.data.comments}
            : post,
        ),
      );
      
      setComment(''); // Clear the comment field
      console.log('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      closeCommentModal(); // Close the modal after adding the comment
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${serverURL}/posts`);
      const reversed = response.data.reverse();

      setPosts(reversed);
      console.log(posts[0])
    } catch (error) {
      console.error('Error fetching posts:', error.response);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };
  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, []),
  );

  const handleLike = async postId => {
    const userId = await AsyncStorage.getItem('userId');
    try {
      const response = await axios.post(`${serverURL}/posts/${postId}/like`, {
        userId: userId,
      });

      setPosts(prevPosts =>
        prevPosts.map(post =>
          post._id === postId ? {...post, likes: response.data.likes} : post,
        ),
      );
      console.log('Post liked successfully');
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const openPdf = pdfUri => {
    const uri = pdfUri;
    setSelectedPdfUri(uri);
    console.log(pdfUri);
    setModalVisible(true);
  };

  const closePdf = () => {
    console.log(selectedPdfUri);
    setModalVisible(false);
    setSelectedPdfUri('');
  };

  const openCommentModal = postId => {
    setSelectedPostId(postId); // Set the selected post ID
    setisCommentModalVisible(true); // Open the comment modal
  };

  const closeCommentModal = () => {
    setisCommentModalVisible(false);
    setSelectedPostId(null); // Reset the selected post ID
    setComment(''); // Clear the comment field
  };
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

  return (
    <View style={styles.container}>

        <ScrollView
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}>
          {posts.map(post => (
            <View key={post._id} style={styles.postCard}>
              <View style={styles.postHeader}>
              <TouchableOpacity onPress={()=>navigation.navigate('profileShare',post.userId)}><Image
                  source={{uri: `${serverURL}/${post.profile}`}}
                  style={styles.profileImage}
                /></TouchableOpacity>
                
                <View style={styles.postInfo}>
                  <Text style={styles.username}>
                    {post.name ? post.name : post.userId}
                  </Text>
                  <Text style={styles.timestamp}>
                    {new Date(post.date).toLocaleTimeString()}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text style={styles.moreOptions}>⋮</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.postContent}>{post.title}</Text>
              <Text style={styles.postContent}>{post.description}</Text>

              {post.imageUri && (
                <Image
                  source={{uri: `${serverURL}/${post.imageUri}`}}
                  style={styles.postImage}
                />
              )}

              {post.pdfUri && (
                <TouchableOpacity
                  style={styles.pdfButton}
                  onPress={() => openPdf(`${serverURL}/${post.pdfUri}`)}>
                  <Text style={styles.pdfButtonText}>View PDF</Text>
                </TouchableOpacity>
              )}

              <View style={styles.postActions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleLike(post._id)}>
                  <Image source={likeIcon} style={styles.iconi} />
                  <Text style={{color: 'black', fontSize: 16}}>
                    {post.likes?.length || 0} Likes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => openCommentModal(post._id)} // Open the comment modal
                >
                  <Image source={commentIcon} style={styles.iconi} />
                  <Text style={{color: 'black', fontSize: 16}}>
                    {post.comments.length} Comments
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.commentsSection}>
                {post.comments.length > 0 ? (
                  post.comments.map((comment, index) => (
                    <View key={index} style={styles.comment}>
                      <Text style={styles.commentUsername}>
                        {comment.userId}
                      </Text>
                      <Text style={styles.commentText}>{comment.comment}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.noComments}>No comments yet.</Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>
      

      {/* Comment Modal */}
      <Modal
        visible={isCommentModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeCommentModal}>
        <View style={styles.modalContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#6b7280"
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            style={styles.commentButton}
            onPress={handleAddComment}>
            <Text style={styles.commentButtonText}>Add Comment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeCommentModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* PDF Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={closePdf}>
        <Pdf
          source={{uri: selectedPdfUri, cache: true}}
          trustAllCerts={false}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={error => {
            console.log(error);
          }}
          onPressLink={pdfuri => {
            console.log(`Link pressed: ${selectedPdfUri}`);
          }}
          style={{flex: 1}}
        />
        {/* <TouchableOpacity style={styles.closeButton} onPress={closePdf}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity> */}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8', // Light grayish-blue background
    padding: 20,
  },
  feed: {
    paddingBottom: 100,
    gap: 15,
  },
  postCard: {
    backgroundColor: '#ffffff', // White background for posts
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postInfo: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: '#1f2937', // Darker blue-gray for username
  },
  timestamp: {
    color: '#6b7280', // Gray for timestamp
    fontSize: 12,
  },
  moreOptions: {
    color: '#3b82f6', // Blue for more options
    fontSize: 18,
  },
  postContent: {
    marginBottom: 10,
    color: '#111827', // Black for post content
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  pdfButton: {
    backgroundColor: '#1d4ed8', // Dark blue for the button background
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  pdfButtonText: {
    color: '#ffffff', // White text
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconi: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  commentsSection: {
    marginTop: 10,
    borderTopColor: '#e5e7eb', // Light gray border for separation
    borderTopWidth: 1,
    paddingTop: 10,
  },
  comment: {
    marginVertical: 5,
    backgroundColor: '#f3f4f6', // Light gray for comments background
    borderRadius: 10,
    padding: 10,
  },
  commentUsername: {
    fontWeight: 'bold',
    color: '#1f2937', // Darker blue-gray for username
  },
  commentText: {
    color: '#4b5563', // Gray for comment text
  },
  noComments: {
    color: '#6b7280', // Gray for no comments text
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff', // White background for the modal
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentInput: {
    height: 40,
    borderColor: '#3b82f6', // Blue for the border
    borderWidth: 1,
    width: '90%',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: '#1f2937', // Dark blue-gray text color
  },
  commentButton: {
    backgroundColor: '#1d4ed8', // Dark blue for the button
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  commentButtonText: {
    color: '#ffffff', // White text
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#ef4444', // Red background for close button
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: '90%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#ffffff', // White text for close button
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
});

export default SocialMediaFeed;
