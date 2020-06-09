import React, { Component } from 'react';
// Import React Native components
import { StyleSheet, Text, View, Platform } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// Import Firebase
const firebase = require('firebase');
require('firebase/firestore');

// Chat Screen 2 
export default class Chat extends Component {

  constructor() {
    super();

    if (!firebase.apps.length) {
      firebase.initializeApp({
        // <!-- The core Firebase JS SDK is always required and must be listed first -->
        // <script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js"></script>
        // <!-- TODO: Add SDKs for Firebase products that you want to use
        //  https://firebase.google.com/docs/web/setup#available-libraries -->
        // <script src="https://www.gstatic.com/firebasejs/7.15.0/firebase-analytics.js"></script>
        // <script>
        // Your web app's Firebase configuration
        // var firebaseConfig = {
        apiKey: "AIzaSyAORBxXKTs5Mwu9SgmApPoue-VyVbedLns",
        authDomain: "mchatapp-fa646.firebaseapp.com",
        databaseURL: "https://mchatapp-fa646.firebaseio.com",
        projectId: "mchatapp-fa646",
        storageBucket: "mchatapp-fa646.appspot.com",
        messagingSenderId: "827523943360",
        appId: "1:827523943360:web:83a7c3549cb55c435c9625",
        measurementId: "G-CP7GQ046XR"
        // Initialize Firebase
        // firebase.initializeApp(firebaseConfig);
        // firebase.analytics();
        // </script>
      });
    }
    this.referenceChatMessages = firebase.firestore().collection('messages');

    this.state = {
      messages: [],
      uid: 0
    };
  }
  componentDidMount() {
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        messages: []
      });

      this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.unsubscribe();
  };

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // Go through each document
    querySnapshot.forEach((doc) => {
      // Get Query Document Snapshot's data
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: data.user
      });
    });

    this.setState({
      messages,
    });
  };

  addMessage() {
    const message = this.state.messages[0];
    this.referenceChatMessages.add({
      _id: message._id,
      text: message.text,
      createdAt: message.createdAt,
      user: message.user
    });
  }
  // Define Navigation bar title
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.userName,
    };
  };
  // Append new message(s) to object
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
    });
  }
  // Render components
  render() {
    return (
      // Fullscreen component
      <View style={{ flex: 1, backgroundColor: this.props.navigation.state.params.backgroundColor }}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1,
          }}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }
};
const styles = StyleSheet.create({
});
