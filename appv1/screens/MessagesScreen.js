import React, { useContext, useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  TouchableOpacity,
  Alert,
  Keyboard
} from 'react-native';
import { GlobalContext } from '../context';

export default function MessagesScreen({ route, navigation }) {
  const [msg, setMsg] = useState([]);
  const [message, setMessage] = useState("")
  const { selecteduser, id } = route.params;
  // access global context here 
  // console.log(selecteduser)
  const { 
    joinChat, 
    userChats, 
    sendPrivateMessage, 
    user,
    recevePrivateMessage,
    saveChats,
    updateChats
   } = useContext(GlobalContext);
   
  useEffect(() => {
    joinChat(selecteduser, id);
  }, [])

  useEffect(() => {
    if(userChats.length > 0 ) {
      const filterdData = userChats.find(c => c.selected_user_id === id);
      if(filterdData && filterdData?.userMessages) {
        setMsg(filterdData?.userMessages)
      }
    }
  }, [msg])

  useEffect(() => {
    recevePrivateMessage()
  }, [message])

  async function sendSms() {
    if (message === "") return Alert.alert("Enter text to send");
    const newMsg = { id: msg.length + 1, msg: message, type: "sent" };
    setMsg(prevMsg => [...prevMsg, newMsg]);
    const filterdData = userChats.find(c => c.selected_user_id === id);

    if(!filterdData) {
      await saveChats(false, id, newMsg, selecteduser);
    } else {
      await updateChats(msg[0].msg);
    }

    sendPrivateMessage(
      user.username,
      selecteduser,
      id,
      message
    );
    setMessage("");
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.arrow}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.username}>
          {selecteduser}
        </Text>
      </View>
      <View style={styles.chatarea}>
        {/* recieved chats are matched here  */}
        { msg.map((rc, index) => (
          <View style={
            rc.type === "sent" ? styles.chatsent : styles.chatreceived
          } key={index}>
            <Text style={styles.recievedText}>{rc["msg"]}</Text>
          </View>
        ))}

      </View>
      <View style={styles.keyboard}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : null}
          style={styles.keyboardArea}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='Type a message...'
              placeholderTextColor="#666"
              onChangeText={setMessage}
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={sendSms}>
              <Text style={styles.sendButtonText}>^</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: "row",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#00AFF0",
    alignItems: "center",
  },
  username: {
    fontWeight: "800",
    color: "#fff",
    marginLeft: 20,
    fontSize: 20,
  },
  arrow: {
    fontSize: 30,
    color: "white",
  },
  chatarea: {
    flex: 1,
    backgroundColor: "#EDEDED", // Light gray background
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  chatreceived: {
    alignSelf: 'flex-start', // Align received messages to the left
    backgroundColor: '#20BDFF', // White background for received messages
    maxWidth: '80%', // Maximum width of the message bubble
    marginBottom: 10,
    borderRadius: 10,
    padding: 5,
  },
  chatsent: {
    alignSelf: 'flex-end', // Align sent messages to the right
    backgroundColor: "#6dd5ed", // Light green background for sent messages
    maxWidth: '80%',
    marginBottom: 10,
    borderRadius: 10,
    padding: 5,
  },
  recievedText: {
    color: "#FFFF",
    fontWeight: "800",
    padding: 5
  },
  keyboardArea: {
    // borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  keyboard: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    padding: 20,
    border: 0,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#00AFF0",
    borderRadius: 20,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 10,
    color: '#333',
    height: 40,
    width: "80%"
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: "#00AFF0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonText: {
    fontSize: 20,
    color: "#FFF",
    fontWeight: "bold"
  }
});
