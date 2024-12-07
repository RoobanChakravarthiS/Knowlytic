import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import * as ImagePicker from 'react-native-image-picker';
import axios from 'axios';

const ReportGenerator = () => {
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  // Handle image picking from gallery or camera
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 0, // Allows multiple image selection
    };

    ImagePicker.launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const selectedImages = response.assets.map(asset => ({
          uri: asset.uri,
          fileName: asset.fileName,
          base64: asset.base64,
        }));
        setImages(prevImages => [...prevImages, ...selectedImages]);
      }
    });
  };

  // Convert images to base64 format
  const convertImagesToBase64 = async (imageUris) => {
    let base64Images = [];
    for (const image of imageUris) {
      const response = await fetch(image.uri);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Data = reader.result.split(',')[1];
        base64Images.push(base64Data);
      };
    }
    return base64Images;
  };

  // Send description and images to backend
  const generateReport = async () => {
    if (!description.trim() || images.length === 0) {
      Alert.alert('Error', 'Please add a description and at least one image');
      return;
    }

    try {
      // Convert images to base64
      const base64Images = await convertImagesToBase64(images);

      // Prepare the payload
      const payload = {
        description:description,
        images: base64Images,
      };
      console.log(payload.images)

      // Send data to backend
      const response = await axios.post('http://10.21.96.34:5001/generate_report', payload);
      if (response.data.success) {
        Alert.alert('Success', 'Report generated successfully!');
      } else {
        Alert.alert('Error', 'Failed to generate report');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      Alert.alert('Error', 'An error occurred while generating the report');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Add Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter description here"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor="#999"
      />

      <Text style={styles.label}>Add Photos</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Select Images</Text>
      </TouchableOpacity>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imagePreviewContainer}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.imagePreview} />
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.generateButton} onPress={generateReport}>
        <Text style={styles.generateButtonText}>Generate Report</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#1d4ed8',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreviewContainer: {
    marginBottom: 20,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  generateButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ReportGenerator;
