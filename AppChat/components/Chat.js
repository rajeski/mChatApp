import React, { Component } from 'react';
// Import React Native components
import NetInfo from "@react-native-community/netinfo";
import { StyleSheet, Text, View, Platform, AsyncStorage } from 'react-native';
import { GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import { decode, encode } from 'base-64';

// Import Firebase
const firebase = require('firebase');
require('firebase/firestore');

if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

import { YellowBox } from "react-native";
YellowBox.ignoreWarnings(["Warning: ..."]);
import CustomActions from "./CustomActions";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

console.disableYellowBox = true;
window.addEventListener = x => x;

// Chat Screen 2 
export default class Chat extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.name
    };
  };
  constructor() {
    super();
    this.state = {
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: ""
      },
      isConnected: false,
      image: null,
      location: null
    };

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
  }
  getMessages = async () => {
    let messages = [];
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
      if (state.isConnected) {
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
      let data = doc.data();
      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        },
        image: data.image || "",
        location: data.location
      });
    });
    this.setState({
      messages
    });
  };

  addMessages = () => {
    const message = this.state.messages[0];
    this.referenceMessages.add({
      _id: message._id,
      text: message.text || "",
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || "",
      location: message.location || null,
      sent: true
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

  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <View>
          <MapView
            style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          />
        </View>
      );
    }
    return null;
  }

  renderCustomActions = props => {
    return <CustomActions {...props} />;
  };

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: this.props.navigation.state.params.backgroundColor }}>
        <Text style={styles.userName}>
          {this.props.navigation.state.params.name} Running History
        </Text>
        {this.state.image && (
          <Image
            source={{ uri: this.state.image.uri }}
            style={{ width: 200, height: 200 }}
          />
        )}
        <GiftedChat
          renderCustomView={this.renderCustomView}
          renderActions={this.renderCustomActions}
          renderInputToolbar={this.renderInputToolbar}
          renderBubble={this.renderBubble}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          image={this.state.image}
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