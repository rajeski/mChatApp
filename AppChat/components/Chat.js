import React, { Component } from 'react';
// Import React Native components
import NetInfo from "@react-native-community/netinfo";
import { StyleSheet, Text, View, Platform, AsyncStorage } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

// Import Firebase
const firebase = require('firebase');
require('firebase/firestore');

// Chat Screen 2 
export default class Chat extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };

  constructor() {
    super();
    // Firebase information 
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
    this.referenceMessages = firebase.firestore().collection("messages");

    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: ""
      },
      uid: 0
    };
  }

  getMessages = async () => {
    let messages = "";
    try {
      messages = (await AsyncStorage.getItem("messages")) || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  saveMessages = async () => {
    try {
      await AsyncStorage.setItem(
        "messages",
        JSON.stringify(this.state.messages)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };
  componentDidMount() {
    NetInfo.fetch().then(state => {
      // console.log('Connection type', state.type);
      if (state.isConnected) {
        // console.log('Is connected?', state.isConnected);
        this.authUnsubscribe = firebase
          .auth()
          .onAuthStateChanged(async user => {
            if (!user) {
              try {
                await firebase.auth().signInAnonymously();
              } catch (error) {
                console.log("Unable to sign in: " + error.message);
              }
            }
            this.setState({
              isConnected: true,
              user: {
                _id: user.uid,
                name: this.props.navigation.state.params.name
              },
              loggedInText:
                this.props.navigation.state.params.name +
                " has entered chat",
              messages: []
            });
            // console.log(user);
            this.unsubscribe = this.referenceMessages
              .orderBy("createdAt", "desc")
              .onSnapshot(this.onCollectionUpdate);
          });
      } else {
        this.setState({
          isConnected: false
        });
        this.getMessages();
      }
    });
  }

  onCollectionUpdate = querySnapshot => {
    const messages = [];
    querySnapshot.forEach(doc => {
      var data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({
      messages
    });
  };

  addMessages = () => {
    this.referenceMessages.add({
      _id: this.state.messages[0]._id,
      text: this.state.messages[0].text,
      createdAt: this.state.messages[0].createdAt,
      user: this.state.messages[0].user,
      uid: this.state.uid
    });
  };

  onSend(messages = []) {
    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),
      () => {
        this.addMessages();
        this.saveMessages();
      }
    );
  }

  renderInputToolbar = props => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };
  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  render() {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: this.props.navigation.state.params.selectedColor
          }
        ]}>
        <Text style={styles.userName}>
          {this.props.navigation.state.params.name} On the ready
        </Text>

        <GiftedChat
          renderInputToolbar={this.renderInputToolbar.bind(this)}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: 1
          }}
        />
        {Platform.OS === "android" ? <KeyboardSpacer /> : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  userName: {
    fontSize: 10,
    color: "#fff",
    alignSelf: "center",
    opacity: 0.5,
    marginTop: 25
  }
});