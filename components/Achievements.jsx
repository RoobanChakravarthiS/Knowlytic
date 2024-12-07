import React, {useCallback, useState} from 'react';
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
} from 'react-native';
// import RNFS from 'react-native-fs';
import LottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import DocumentPicker from 'react-native-document-picker';
import Pdf from 'react-native-pdf'; // Import PDF viewer
import likeIcon from '../assets/like.png';
import commentIcon from '../assets/comment.png';
import profilePlaceholder from '../assets/Profile.png';
import addAchievementIcon from '../assets/addAchievement.png';
import RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect} from 'react';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import car from '../assets/car.json'
import { useFocusEffect } from '@react-navigation/native';
const Achievements = () => {
  const [details, setDetails] = useState({});
  const [posts, setPosts] = useState([]);
  const [points, setPoints] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [pdfModalVisible, setPdfModalVisible] = useState(false); // State for PDF modal
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('');
  const [pimageUri, setPimageUri] = useState(null);
  const [pdfUri, setPdfUri] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comment ,setComment] = useState('');
  const [profileImageUri, setProfileImageUri] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const serverURL = 'http://10.21.96.34:5000';
  const [selectedPostId, setSelectedPostId] = useState(null);
  // const [loading, setLoading] = useState(false); 
  const [carLoading,setCarLoading] = useState(true)
  
  useFocusEffect(
useCallback(() => {
        const getUserId = async () => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          // const userId ='670f9070c3a75ff11ad5ce14';
          if (userId !== null) {
            console.log('Retrieved user ID:', userId);
            await fetchUserDetails(userId); // Fetch user details with the user ID
          }
        } catch (error) {
          console.error('Failed to retrieve user ID', error);
        }
        finally{
          setTimeout(()=>setCarLoading(false))
        }
      };
  
      const fetchUserDetails = async userId => {
        try {
          const response = await axios.get(`${serverURL}/user/${userId}`);
          if (response.status === 200) {
            console.log(response.data);
            setDetails(response.data);
            console.log(response.data.profileImage + " profile picture")
            // const serverURL = 'http://192.168.96.154:5000';
            const imagePath = `/${response.data.profileImage}`;
            const imageURI = `${serverURL}${imagePath}`;
            console.log(imageURI);
            // const uri = await convertImageToURI(response.data.profileImage);
            setProfileImageUri(imageURI);
            console.log(profileImageUri)
            setPosts(response.data.posts.reverse());
          }
        } catch (error) {
          setError(
            error.response?.data?.message || 'Error fetching user details',
          );
          console.error('Error fetching user details', error);
        } finally {
          
          
        }
      };
  
      getUserId();
    }, [])
  );

  const uploadDetails = async () => {
    // event.persist();
    const userId = await AsyncStorage.getItem('userId');

    const formData = new FormData();
    console.log('hii');
    // console.log(name)
    // Append form fields
    formData.append('name', details.name);
    formData.append('schoolCode', details.schoolCode);
    formData.append('email', details.email);
    formData.append('phone', details.phone);

    // Append the profile image (if available)
    if (pimageUri) {
      console.log('heloo');
      console.log(pimageUri);
      const fileType = pimageUri.split('.').pop(); // Get the file type/extension
      console.log(fileType);
      console.log(pimageUri)
      formData.append('profileImage', {
        uri: pimageUri,
        type: `image/${fileType}`, // e.g., image/jpeg
        name: `profileImage.${fileType}`, // Use the file extension
      });
      
    }
    console.log(`${serverURL}/user/${userId}` + " idhu inga paa");

    try {
      console.log(`${serverURL}/user/${userId}`);
      const response = await axios.put(`${serverURL}/user/${userId}`,formData,{
        headers: { 'Content-Type': 'multipart/form-data' }
      })

      if (response.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'User details updated successfully 👌',
        });
        setDetailsModalVisible(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to update user details 😞',
        });
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error('Error Response:', error.response.data);
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      } else if (error.request) {
        // Request was made but no response was received
        console.error('No Response:', error.request);
      } else {
        // Something else happened
        console.error('Error Message:', error.message);
      }
      console.error('Error Config:', error.config);
    
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An error occurred while updating user details 😞',
      });
    }
    
  };
 
 
 
  useEffect(()=>{
    console.log(carLoading)
  },[carLoading])

  const handleImageUpload = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then(image => {
        setPimageUri(image.path);
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
      });
  };

  const handlepImageUpload = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      cropperCircleOverlay: true,
    })
      .then(image => {
        setProfileImageUri(image.path);
        // console.log(profileImageUri)
      })
      .catch(error => {
        console.log('ImagePicker Error: ', error);
      });
  };

  const handlePdfUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf],
      });
      console.log('Document Picker Response: ', res);

      const contentUri = res[0].uri;

      // Convert content URI to file path using react-native-fs
      const destPath = `${RNFS.DocumentDirectoryPath}/${res[0].name}`;
      await RNFS.copyFile(contentUri, destPath);

      setPdfUri(`file://${destPath}`); // Set the file path as the PDF URI
      console.log('PDF file path:', destPath);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User canceled PDF picker');
      } else {
        Alert.alert('Error', 'Something went wrong while picking the file');
        console.error('PDF Picker Error: ', err);
      }
    }
  };

  const handlePostAchievement = async () => {
    const currentUserId = await AsyncStorage.getItem('userId');

    if (title && description && date && category && currentUserId) {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('date', date);
      formData.append('category', category);
      formData.append('points', 10); // If you want to send points too
      // Include the user ID

      // Only append files if the URIs are valid
      if (pimageUri) {
        formData.append('image', {
          uri: pimageUri,
          type: 'image/jpeg', // Change according to the image type
          name: 'profileImage.jpg', // Change to a meaningful name
        });
      }

      if (pdfUri) {
        formData.append('pdf', {
          uri: pdfUri,
          type: 'application/pdf', // Change according to the PDF type
          name: 'document.pdf', // Change to a meaningful name
        });
      }
      setCarLoading(true);

      try {
        const response = await axios.post(
          `${serverURL}/achievements/${currentUserId}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // Important for file uploads
            },
          },
        );

        console.log('Posted achievement:', response.data.posts);
       
        setPoints(points + 10);
        // alert('Achievement posted successfully!');
        resetFields();
        setModalVisible(false);
      } catch (error) {
        console.error(
          'Error posting achievement:',
          error.response?.data || error.message,
        );
        alert('Failed to post achievement.');
      }
      finally{
        setTimeout(()=>setCarLoading(false))
      }
    } 
    else {
      alert('Please fill in all fields and upload files.');
    }
  };

  const resetFields = () => {
    setTitle('');
    setDescription('');
    setDate('');
    setCategory('');
    setPimageUri(null);
    setPdfUri(null);
  };

  

  const handleLike = async(postId) => {
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
    setPdfModalVisible(true);
  };

  const closePdf = () => {
    console.log(selectedPdfUri);
    setPdfModalVisible(false);
    setSelectedPdfUri('');
  };

  const handleComment = async () => {
    if (!selectedPostId) return; // Ensure we have a selected post

    const userId = await AsyncStorage.getItem('userId');

    try {
      console.log(userId +  " hi  " + comment)
      const response = await axios.post(
        `${serverURL}/posts/${selectedPostId}/comment`,
        {
          userId:userId,
          comment:comment,
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
  const handleViewPdf = uri => {
    setPdfUri(uri); // Set the selected PDF URI
    setPdfModalVisible(true); // Open the PDF viewer modal
  };
  const openCommentModal=(postid)=>{
    setCommentModalVisible(true);
    setSelectedPostId(postid);
  }

  const submitComment = () => {
    if (commentText && selectedAchievement) {
      const updatedPosts = posts.map(item => {
        if (item.id === selectedAchievement.id) {
          return {
            ...item,
            comments: [...item.comments, commentText],
          };
        }
        return item;
      });
      setPosts(updatedPosts);
      setCommentText('');
      setCommentModalVisible(false);
      setSelectedAchievement(null);
    } else {
      alert('Please enter a comment.');
    }
  };

  return (
    <View style={styles.container}>
    {carLoading ? (
        <View style={styles.loadingContainer}>
            <LottieView
                source={car}
                autoPlay
                loop
                style={styles.loadingAnimation}
            />
        </View>
    ):(<>
      <View style={styles.details}>
        <View style={styles.profileContainer}>
            <Image
                source={profileImageUri ? { uri: profileImageUri } : profilePlaceholder}
                style={styles.pprofileImage}
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
        <View style={styles.editContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
                <Text style={styles.uploadButtonText}>Upload Image</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.uploadButton} onPress={() => setDetailsModalVisible(true)}>
                <Text style={styles.uploadButtonText}>Edit Details</Text>
            </TouchableOpacity>
        </View>
    </View>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Image source={addAchievementIcon} style={styles.icon} />
        </TouchableOpacity>
        <ScrollView style={styles.feed} showsVerticalScrollIndicator={false}>
            {posts.map(post => (
                <View key={post._id} style={styles.postCard}>
                    <View style={styles.postHeader}>
                        <Image
                            source={{ uri: `${serverURL}/${post.profile}` }}
                            style={styles.profileImage}
                        />
                        <View style={styles.postInfo}>
                            <Text style={styles.username}>{post.name}</Text>
                            <Text style={styles.timestamp}>{new Date(post.date).toLocaleTimeString()}</Text>
                        </View>
                        <TouchableOpacity>
                            <Text style={styles.moreOptions}>⋮</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.postContent}>{post.title}</Text>
                    <Text style={styles.postContent}>{post.description}</Text>

                    {post.imageUri && (
                        <Image
                            source={{ uri: `${serverURL}/${post.imageUri}` }}
                            style={styles.postImage}
                        />
                    )}

                    {post.pdfUri && (
                        <TouchableOpacity style={styles.pdfButton} onPress={() => handleViewPdf(post.pdfUri)}>
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
                                    <Text style={styles.commentUsername}>{comment.userId}</Text>
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
    </ScrollView>
    </>)}
    
    <Toast ref={ref => Toast.setRef(ref)} config={toastConfig}/>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalView}>
          <TextInput
            placeholder="Title"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Description"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Date"
            value={date}
            onChangeText={setDate}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleImageUpload}>
            <Text style={styles.uploadButtonText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handlePdfUpload}>
            <Text style={styles.uploadButtonText}>Upload PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handlePostAchievement}>
            <Text style={styles.submitButtonText}>Post Achievement</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* Modal for editing details */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailsModalVisible}
        onRequestClose={() => setDetailsModalVisible(false)}>
        <View style={styles.modalView}>
          <TextInput
            placeholder="Name"
            value={details.name}
            onChangeText={text => setDetails({...details, name: text})}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="schoolCode"
            value={details.schoolCode} // Convert age to string for the TextInput
            onChangeText={text => setDetails({...details, schoolCode: text})}
            style={styles.input}
            keyboardType="numeric" // Use numeric keyboard for age
            placeholderTextColor="#888"
          />

          <TextInput
            placeholder="Email"
            value={details.email}
            onChangeText={text => setDetails({...details, email: text})}
            style={styles.input}
            keyboardType="email-address"
            placeholderTextColor="#888"
          />
          <TextInput
            placeholder="Phone"
            value={details.phone}
            onChangeText={text => setDetails({...details, phone: text})}
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor="#888"
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={uploadDetails} // Close modal after editing
          >
            <Text style={styles.submitButtonText}>Save Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setDetailsModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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
            onChangeText={(text)=> setComment(text)}
            style={styles.input}
            placeholderTextColor="#888"
          />
          <TouchableOpacity style={styles.submitButton} onPress={handleComment}>
            <Text style={styles.submitButtonText} >Submit Comment</Text>
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
        transparent={false}
        visible={pdfModalVisible}
        onRequestClose={() => setPdfModalVisible(false)}>
        <Pdf
        trustAllCerts={false}
          source={{uri: `${serverURL}/${pdfUri}`, cache: true}}
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
            console.log(`Link pressed: ${pdfuri}`);
          }}
          style={{flex: 1}}
        />
        <TouchableOpacity onPress={() => setPdfModalVisible(false)}>
          <Text>Close</Text>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e7ff',
    padding: 16,
  },
  details: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileContainer: {
    display:'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent:'space-between'
  },
  pprofileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  personal: {
    marginLeft: 10,
  },
  detailText: {
    color: '#4b5563',
  },
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  uploadButton: {
    backgroundColor: '#1d4ed8',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '48%',
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
  },
  addButton: {
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
  totalPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  achievementsList: {
    marginTop: 10,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute', // Ensure it overlays other content
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Optional: dim the background
  },
  loadingAnimation: {
    width: 300, // Adjust size as necessary
    height: 300,
  },
  
  pdfbutton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  
  modalView: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    borderRadius: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#fff',
  },
  closeButton: {
    backgroundColor: '#f56565',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
  },
  pdfModal: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  feed: {
    flex: 1,
  },
  postCard: {
    backgroundColor: '#ffffff', // White background for post
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
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
    color: '#4b5563', // Darker gray for username
  },
  timestamp: {
    color: '#6b7280', // Gray timestamp
    fontSize: 12,
  },
  moreOptions: {
    color: '#3b82f6', // Blue for more options
    fontSize: 18,
  },
  postContent: {
    marginBottom: 10,
    color: '#000', // Darker gray for post content
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#f44336', // Red background for close button
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    width:'40%'
  },
  closeButtonText: {
    color: '#ffffff', // White text
  },
  pdf: {
    flex: 1,
    borderRadius: 10,
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
  },
  commentInput: {
    height: 40,
    borderColor: '#3b82f6',
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
    color: '#4b5563',
  },
  commentButton: {
    backgroundColor: '#3b82f6',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  commentsSection: {
    marginTop: 10,
    borderTopColor: '#e5e7eb', // Light gray border for separation
    borderTopWidth: 1,
    paddingTop: 10,
  },

  comment: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f9fafb', // Light background for comments
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },

  commentUsername: {
    fontWeight: 'bold',
    color: '#4b5563', // Darker gray for username
  },

  commentText: {
    color: '#6b7280', // Gray for comment text
  },

  noComments: {
    color: '#6b7280', // Gray for no comments message
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: 10,
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

export default Achievements;

