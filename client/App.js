import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import Paho from 'paho-mqtt';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');

  useEffect(() => {
    const brokerHost = '192.168.16.105'; 
    const brokerPort = 9001;
    const brokerPath = '/';
    const clientId = 'reactNativeClient_' + Math.random().toString(16).substr(2, 8);

    const client = new Paho.Client(brokerHost, brokerPort,brokerPath, clientId);
    client.connect(
      {
        onSuccess: () => {
          setConnectionStatus('Connected');
          client.subscribe('/score');
        },
        onFailure: (error) => {
          setConnectionStatus('Connection failed: ' + error.errorMessage);
        },
      }
    );

    client.onMessageArrived = (message) => {
      const payload = message.payloadString;
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, payload];
        return newMessages.length > 10 ? newMessages.slice(1) : newMessages;
      });
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text>Connection Status: {connectionStatus}</Text>
       <ScrollView style={styles.messageList}>
        {messages.map((message, index) => (
          <View key={index} style={styles.messageContainer}>
            <Text>{message}</Text>
          </View>
        ))}
      </ScrollView> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    padding: 10,
  },
  messageList: {
    marginTop: 20,
  },
  messageContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});