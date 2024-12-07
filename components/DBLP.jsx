import { StyleSheet, Text, View, TouchableOpacity, Alert, Modal } from 'react-native';
import React, { useState } from 'react';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import bibtexParse from 'bibtex-parse-js';
import DocumentPicker from 'react-native-document-picker';
import axios from 'axios';
import Pdf from 'react-native-pdf';

const DBLP = () => {
  const [parsedData, setParsedData] = useState(null);
  const [fileType, setFileType] = useState('');
  const[pdfURI,setPdfURI] = useState(null);
  const[modalVisible,setModalVisible] = useState(false);
  const [selectedPdfUri,setSelectedPdfUri] = useState(``)
  // Handle BibTeX file processing
  const handleBibTexFile = async (filePath) => {
    try {
      const fileData = await RNFS.readFile(filePath);
      const bibtexData = bibtexParse.toJSON(fileData);
      setParsedData(bibtexData);
      setFileType('BibTeX');
    } catch (error) {
      Alert.alert('Error', 'Error reading BibTeX file');
    }
  };
  const openPdf =()=>{
    setModalVisible(true)
    setSelectedPdfUri(`http://10.21.96.34:5000/${pdfURI}`);
  }
  // Handle Excel file processing
  const closePdf =()=>{
    setModalVisible(false)
  }
  const handleExcelFile = async (filePath) => {
    try {
      const fileData = await RNFS.readFile(filePath, 'base64');
      const workbook = XLSX.read(fileData, { type: 'base64' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setParsedData(jsonData);
      setFileType('Excel');
    } catch (error) {
      Alert.alert('Error', 'Error reading Excel file');
    }
  };

  // Handle file picking
  const pickFile = async () => {
    try {
      const response = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });
      const res = response[0]; // Adjusting for array response

      console.log('Picked file:', res);

      if (res.name.endsWith('.xlsx') || res.name.endsWith('.xls')) {
        await handleExcelFile(res.uri); // Process Excel file
      } else if (res.name.endsWith('.bib')) {
        await handleBibTexFile(res.uri); // Process BibTeX file
      } else {
        Alert.alert('Error', 'Unsupported file type. Please upload an Excel or BibTeX file.');
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
      } else {
        console.error('DocumentPicker error:', err);
        Alert.alert('Error', 'An unexpected error occurred while picking the file.');
      }
    }
  };

  // Handle report generation by sending data to Flask backend
  const generateReport = async () => {
    try {
      if (!parsedData) {
        Alert.alert('Error', 'No data to generate report.');
        return;
      }

      const response = await axios.post('http://10.21.96.34:5001/generatejson', {parsedData:parsedData}, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      Alert.alert('Report', response.data.message);
      console.log('PDF Path:', response.data.path);
      setPdfURI(response.data.path);
    } catch (error) {
      if (error.response) {
        Alert.alert('Error', `Error: ${error.response.data.error}`);
      } else {
        Alert.alert('Error', 'An unexpected error occurred while generating the report.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publication Summary Tool</Text>

      <TouchableOpacity style={styles.button} onPress={pickFile}>
        <Text style={styles.buttonText}>Upload File (Excel/BibTeX)</Text>
      </TouchableOpacity>

      {parsedData ? (
        <TouchableOpacity style={styles.reportButton} onPress={generateReport}>
          <Text style={styles.reportButtonText}>Generate Report</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.placeholderText}>No file uploaded yet.</Text>
      )}
      {pdfURI ?( <TouchableOpacity style={styles.reportButton} onPress={openPdf}>
          <Text style={styles.reportButtonText}>Show Report</Text>
        </TouchableOpacity>):null}
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
    </View>
  );
};

export default DBLP;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e0e7ff',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  reportButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    elevation: 3,
    marginTop: 20,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
  },
});
