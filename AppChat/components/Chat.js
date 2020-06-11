import React, { Component } from 'react';
// Import React Native components
import NetInfo from "@react-native-community/netinfo";
import { StyleSheet, Text, View, Platform, AsyncStorage } from 'react-native';
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
        apiKey: "AIzaSyAORBxXKTs5Mwu9SgmApPoue-VyVbedLns",
        authDomain: "mchatapp-fa646.firebaseapp.com",
        databaseURL: "https://mchatapp-fa646.firebaseio.com",
        projectId: "mchatapp-fa646",
        storageBucket: "mchatapp-fa646.appspot.com",
        messagingSenderId: "827523943360",
        appId: "1:827523943360:web:83a7c3549cb55c435c9625",
        measurementId: "G-CP7GQ046XR"
      });
    }
    this.referenceMessageUser = null;
    this.referenceMessages = firebase.firestore().collection('messages');

    this.state = {
      messages: [],
      uid: 0,
      isConnected: false,
      user: {
        _id: '',
        name: '',
        avatar: ''
      },
    };
  }

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  get user() {
    return {
      name: this.props.navigation.state.params.name,
      _id: this.state.uid,
      id: this.state.uid,
    }
  }

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
    console.log(this.state.user)
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text || '',
      createdAt: this.state.messages[0].createdAt,
      user: this.state.user,
      image: this.state.messages[0].image || '',
      location: this.state.messages[0].location || null,
      uid: this.state.uid,
    });
  }

  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessage();
        this.saveMessage();
      }
    );
  }

  // Functions: Get asyncStorage messages
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  // Save asyncStorage messages
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  // delete messages from asyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
    } catch (error) {
      console.log(error.message);
    }
  }
  componentDidMount() {
    NetInfo.isConnected.fetch().then(isConnected => {
      if (isConnected === true) {
        console.log('Online');
        this.setState({
          isConnected: true,
        })

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          // User state is updated 
          this.setState({
            uid: user.uid,
            user: {
              _id: user.uid,
              name: this.props.navigation.state.params.name,
              avatar: '',
            },
            loggedInText: 'Welcome'
          });
          this.referenceMessageUser = firebase.firestore().collection('messages');
          this.unsubscribeMessageUser = this.referenceMessageUser.onSnapshot(thi.onCollectionUpdate);
        });
      } else {
        console.log('You are offline');
        this.setState({
          isConnected: false,
        });
        this.getMessages();
      }
    })
  }

  componentWillUnmount() {
    // User Authentication
    this.authUnsubscribe();
    // User Changes
    this.unsubscribeMessageUser();
  }

  // When offline hide Input-bar
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  };

  // Render components
  render() {
    return (
      // Fullscreen component
      <View style={{ flex: 1, backgroundColor: this.props.navigation.state.params.backgroundColor }}>
        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.uid
          }}
        />
        {Platform.OS === 'android' ? <KeyboardSpacer /> : null}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  }
});