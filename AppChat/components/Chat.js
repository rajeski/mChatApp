// Check for ES6 codebase compatibility 

/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/jsx-filename-extension */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/no-unused-state */
/* eslint-disable react/prop-types */

/**
 * @description Chatscreen, write/send messages; share images/take photo; or
 * share their geo-location
 * @class Chat
 * @requires React
 * @requires React-Native
 * @requires Keyboard-Spacer
 * @requires React-Native-Gifted-Chat
 * @requires CustomActions
 * @requires React-Native-Maps
 * @requires Firebase
 * @requires Firestore
 */

// Import NetInfo; React and React-native components; dependencies and libraries 

import React, { Component } from 'react';
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

// Create Chat Screen 2 class 
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

    /**
     * Initialize Firebase
     * @param {object} firebaseConfig
     * @param {string} apiKey
     * @param {string} authDomain
     * @param {string} databaseURL
     * @param {string} projectID
     * @param {string} storageBucket
     * @param {string} messagingSenderId
     * @param {string} appId
     */

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

  /**
  * Loads AsyncStorage (a global, key-value store for the app) messages 
  * @async
  * @function getMessages
  * @param {string} messages
  * @return {state} messages
  */

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

  /**
  * Saves AsyncStorage messages
  * @function saveMessages 
  * @async
  */

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

  /**
* Deletes AsyncStorage (a global, key-value store for the app) messages
* @async
* @function deleteMessages
* @param {string} messages
* @return {AsyncStorage}
*/

  deleteMessages = async () => {
    try {
      await AsyncStorage.removeItem("messages");
    } catch (error) {
      console.log(error.message);
    }
  };

  /** componentDidMount is a "lifecycle method" running at various points/times
   * during a components' lifecycle. 
   * NetInfo is a library granting access for a user's current network status, 
   * e.g., user is connected and/or disconnected from the network.
   */

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

  /**
      * Update message state with recent data (this modifies existing an 
      * document and/or documents in a collection)
      * @function onCollectionUpdate
      * @param {string} _id - Message ID
      * @param {string} text - Content
      * @param {date} cratedAt - Date / Timestamp
      * @param {string} user - User data
      * @param {string} image - Image sent
      * @param {number} location - Geo-location
      * @param {boolean} sent
      * @returns {state}
      */

  /**
   *
   * @param {querySnapShot}: Object: Firestore Collection: Messages 
   * This function is called from componentDidMount after the Firestore message
   * collection has been loaded. This is where the messages are initially loaded 
   * into state (GC-tribute line!)
   * 
   */

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

  /**
  * Add message (interconnection between the ChatApp and Firebase)
  * @function addMessage
  * @param {string} _id - Message ID
  * @param {string} text - Content
  * @param {date} cratedAt - Date / Timestamp
  * @param {string} image - Image sent 
  * @param {number} location - Geo-location
  * @param {boolean} sent
  */

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

  /**
* Sends messages (using the GiftedChat library for this functionality)
* @async
* @function onSend
* @param {string} messages
* @return {state} GiftedChat
*/

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

  /**
    * Input toolbar rendered if/when online (enabling this functionality)
    * @function renderInputToolbar
    * @param {*} props
    * @returns {InputToolbar}
    */

  renderInputToolbar = props => {
    if (this.state.isConnected === false) {
    } else {
      return <InputToolbar {...props} />;
    }
  };

  /**
    * @function renderCustomView (geo-location functionality for the app)
    * @param {*} props
    * @returns {MapView}
    * @returns {boolean} false
    */

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

  /**
   * Renders getLocation; pickImage; takePhoto (end-user's menu options)
   * @function renderCustomActions
   * @param {*} props
   * @returns {CustomActions}
   */

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