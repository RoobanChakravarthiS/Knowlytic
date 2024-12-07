import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';

// Sample user data and messages for demonstration
const sampleMessages = [
  {
    id: '1',
    user: 'Alice',
    message: 'Hello everyone!',
    timestamp: '10:00 AM',
    avatar: require('../assets/comment.png'),
  },
  {
    id: '2',
    user: 'Bob',
    message: 'Hi Alice!',
    timestamp: '10:01 AM',
    avatar: require('../assets/like.png'),
  },
  {
    id: '3',
    user: 'Charlie',
    message: 'What’s up?',
    timestamp: '10:02 AM',
    avatar: require('../assets/close.png'),
  },
  {
    id: '4',
    user: 'You',
    message: 'I’m doing well, thanks!',
    timestamp: '10:03 AM',
    avatar: require('../assets/upload.png'), // Add your avatar here
  },
  {
    id: '5',
    user: 'Alice',
    message: 'Glad to hear that!',
    timestamp: '10:04 AM',
    avatar: require('../assets/comment.png'),
  },
  {
    id: '6',
    user: 'Bob',
    message: 'What are you all up to today?',
    timestamp: '10:05 AM',
    avatar: require('../assets/like.png'),
  },
  // Add more sample messages as needed
];

const ChatCommunity = () => {
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null); // Reference to FlatList

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: (messages.length + 1).toString(),
        user: 'You',
        message: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        avatar: require('../assets/upload.png'), // Add your avatar here
      };

      // Add new message to messages array
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage(''); // Clear input field

      // Scroll to the bottom after adding a new message
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderMessageItem = ({ item }) => (
    <View style={styles.messageContainer}>
      <Image source={item.avatar} style={styles.avatar} />
      <View
        style={
          item.user === 'You' ? styles.yourMessageBubble : styles.messageBubble
        }
      >
        <Text style={item.user === 'You' ? styles.myMessageText : styles.messageUser}>{item.user}</Text>
        <Text style={item.user === 'You' ? styles.myMessageText : styles.messageText}>{item.message}</Text>
        <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={60}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Text style={styles.header}>Group Chat</Text>
          <FlatList
            data={messages}
            renderItem={renderMessageItem}
            keyExtractor={(item) => item.id}
            ref={flatListRef} // Attach the ref here
            contentContainerStyle={styles.messagesList}
            keyboardShouldPersistTaps="always" // Ensure taps on input work correctly
            inverted={false} // Don't invert the list
            onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })} // Scroll to bottom on content size change
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Type a message..."
              value={newMessage}
              onChangeText={setNewMessage}
              placeholderTextColor="#aaaaaa"
            />
            <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ChatCommunity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  innerContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'flex-end', // Align input at the bottom
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 10,
    textAlign: 'center',
    paddingVertical: 15,
    backgroundColor: '#6a1b9a',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  messagesList: {
    flexGrow: 1, // Allow messages to take all available space
    paddingBottom: 10, // Ensure there's space for the input
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
    paddingHorizontal: 10,
  },
  messageBubble: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 15,
    maxWidth: '75%',
    marginLeft: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  yourMessageBubble: {
    backgroundColor: '#6a1b9a',
    borderRadius: 20,
    padding: 15,
    maxWidth: '75%',
    marginRight: 10,
    color: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  messageUser: {
    fontWeight: 'bold',
    color: '#6a1b9a',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  myMessageText: {
    fontSize: 16,
    color: '#fff',
    marginVertical: 5,
  },
  messageTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 3,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    marginRight: 10,
    elevation: 1,
    color:'#000',
  },
  sendButton: {
    backgroundColor: '#6a1b9a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    elevation: 3,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
});
