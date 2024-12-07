import {
    Button,
    StyleSheet,
    TextInput,
    View,
    Text,
    TouchableOpacity,
    Alert,
    Modal,
  } from 'react-native';
  import React, { useState, useEffect } from 'react';
  import axios from 'axios';
  import RNFS from 'react-native-fs';
  import Pdf from 'react-native-pdf';
  import { Linking } from 'react-native';
  import { PermissionsAndroid } from 'react-native';
  
  const GS = () => {
    const [name, setName] = useState('');
    const [startYear, setStartYear] = useState('');
    const [endYear, setEndYear] = useState('');
    const serverURL = `http://10.21.96.34:5001`;
    const [pdf_path, setPdf_path] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedPdfUri, setSelectedPdfUri] = useState();
    const [downloadedFilePath, setDownloadedFilePath] = useState(null);
    const [keyword,setKeyword] = useState('')
    const downloadPdf = async (pdfUri) => {
      const fileName = pdfUri.split('/').pop();
      const localFilePath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
  
      const options = {
        fromUrl: pdfUri,
        toFile: localFilePath,
      };
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        Alert.alert('Permission Denied', 'You need to give permission to download the file.');
        return;
      }
  
      try {
        const response = await RNFS.downloadFile(options).promise;
        if (response.statusCode === 200) {
          Alert.alert('Download Success', 'PDF downloaded successfully.');
          setDownloadedFilePath(localFilePath);
        } else {
          Alert.alert('Download Failed', 'Failed to download the PDF.');
        }
      } catch (error) {
        console.error('Download error:', error);
        Alert.alert('Error', 'Failed to download the PDF. Please try again.');
      }
    };
  
    const openPdf = pdfUri => {
      const formattedUri = pdfUri;
      setSelectedPdfUri(formattedUri);
      setModalVisible(true);
      console.log(selectedPdfUri)
      
    };
  
    const requestStoragePermission = async () => {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message: 'This app needs access to your storage to download files.',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    };
  
    const closePdf = () => {
      setModalVisible(false);
      setSelectedPdfUri('');
    };
  
    const generateReport = async () => {
      if (!name) {
        Alert.alert('Error', "Please enter the author's name.");
        return;
      }
      
    //   if (!startYear || !endYear) {
    //     Alert.alert('Error', 'Please enter both start and end years.');
    //     return;
    //   }
  
      try {
        const response = await axios.post(`${serverURL}/generate_pdf`, {
          author_name: name,
          start_year: startYear!==''?startYear:'0000', // Add this field for start year
          end_year: endYear!==''?endYear:'2024', // Add this field for end year
          keyword:keyword
        });
  
        setPdf_path(response.data.path);
        console.log(pdf_path+ " hi")
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to generate the report. Please try again.');
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Generate Report</Text>
  
        <TextInput
          placeholder="Enter author Name"
          style={styles.input}
          placeholderTextColor="#888"
          value={name}
          onChangeText={text => setName(text)}
        />
        <TextInput
          placeholder="Enter Keyword"
          style={styles.input}
          placeholderTextColor="#888"
          value={keyword}
          onChangeText={text => setKeyword(text)}
        />
  
        <TextInput
          placeholder="Enter Start Year"
          style={styles.input}
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={startYear}
          onChangeText={text => setStartYear(text)}
        />
  
        <TextInput
          placeholder="Enter End Year"
          style={styles.input}
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={endYear}
          onChangeText={text => setEndYear(text)}
        />
  
        <TouchableOpacity onPress={generateReport} style={styles.buttonContainer}>
          <Text style={styles.buttonText}>Generate Report</Text>
        </TouchableOpacity>
  
        {pdf_path && (
          <View>
            <TouchableOpacity
              style={styles.pdfButton}
              onPress={() => openPdf(`http://10.21.96.34:5000/${pdf_path}`)}>
              <Text style={styles.pdfButtonText}>View PDF</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.pdfButton}
              onPress={() => downloadPdf(`http://10.21.96.34:5000/${pdf_path}`)}>
              <Text style={styles.pdfButtonText}>Download PDF</Text>
            </TouchableOpacity> */}
          </View>
        )}
  
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={closePdf}>
          <Pdf
            source={{ uri: `${selectedPdfUri}`, cache: true }}
            trustAllCerts={false}
            onLoadComplete={(numberOfPages, filePath) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onError={error => {
              console.log(error);
            }}
            style={{ flex: 1 }}
          />
        </Modal>
  
        {/* {downloadedFilePath && (
          <TouchableOpacity
            onPress={() => openFile(downloadedFilePath)}
            style={styles.pdfButton}>
            <Text style={styles.buttonText}>Open Downloaded PDF</Text>
          </TouchableOpacity>
        )} */}
      </View>
    );
  };
  
  export default GS;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#e0e7ff',
      padding: 20,
    },
    heading: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#000',
    },
    input: {
      height: 40,
      borderColor: '#3b82f6',
      borderWidth: 1,
      borderRadius: 10,
      marginBottom: 15,
      paddingHorizontal: 10,
      color: '#000',
      width: '100%',
      backgroundColor: '#fff',
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    buttonContainer: {
      backgroundColor: '#3b82f6',
      paddingVertical: 12,
      paddingHorizontal: 30,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 3 },
      shadowRadius: 6,
      elevation: 5,
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    pdfButton: {
      backgroundColor: '#1d4ed8',
      padding: 10,
      borderRadius: 10,
      alignItems: 'center',
      margin: 10,
    },
  });
  