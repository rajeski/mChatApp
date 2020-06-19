// Check for ES6 codebase compatibility 

/* eslint-disable react/jsx-filename-extension */

/**
* @description StartScreen, user can type name and select chat-screen 
* background color
* @class Start
* @requires React
* @requires React-Native
*/

import React, { Component } from 'react';
// Import React Native components
import { StyleSheet, Text, View, TextInput, Button, Alert, ImageBackground, TouchableOpacity } from 'react-native';

// Start, Chat Screen 1 class
export default class Start extends Component {

  // Define state
  state = {
    userName: '',
    backgroundColor: ''
  }

  // Render components
  render() {
    return (
      <ImageBackground source={require("../assets/BackgroundImage.png")} style={styles.backgroundImage}>
        { /*App title*/}
        <Text style={styles.appTitle}>ChatApp</Text>
        { /*Login container*/}
        <View style={styles.logIn}>
          { /*Text input form*/}
          <TextInput
            style={styles.userNameInput}
            onChangeText={(userName) => this.setState({ userName })}
            value={this.state.userName}
            placeholder='Your Name...'
          />
          { /*Select background color*/}
          <Text style={styles.choseBackgroundColor}>Choose Background Color:</Text>
          { /*Wrapper for available background colors*/}
          <View style={styles.backgroundColorWrapper}>
            { /*Black*/}
            <TouchableOpacity onPress={() => { this.setState({ backgroundColor: '#090C08' }) }}>
              <View style={[styles.backgroundColor, styles.black]} >
              </View>
            </TouchableOpacity>
            { /*Purple*/}
            <TouchableOpacity onPress={() => { this.setState({ backgroundColor: '#474056' }) }}>
              <View style={[styles.backgroundColor, styles.purple]}>
              </View>
            </TouchableOpacity>
            { /*Gray*/}
            <TouchableOpacity onPress={() => { this.setState({ backgroundColor: '#8A95A5' }) }}>
              <View style={[styles.backgroundColor, styles.gray]}>
              </View>
            </TouchableOpacity>
            { /*Green*/}
            <TouchableOpacity onPress={() => { this.setState({ backgroundColor: '#B9C6AE' }) }}>
              <View style={[styles.backgroundColor, styles.green]}>
              </View>
            </TouchableOpacity>
          </View>
          { /*Let's Chat --> directs user to chat screen*/}
          <Button
            onPress={() => {
              this.props.navigation.navigate('Chat', { userName: this.state.userName, backgroundColor: this.state.backgroundColor });
            }}
            title="Start Chatting"
            color='#757083'
            style={styles.startChatButton}
          />
        </View>
      </ImageBackground>
    );
  }
};

// Stylesheets
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    resizeMode: 'cover'
  },
  logIn: {
    height: '44%',
    width: '88%',
    backgroundColor: 'white',
    marginBottom: '6%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  appTitle: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: '6%'
  },
  userNameInput: {
    width: '88%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    fontSize: 16,
    color: '#757083',
    fontWeight: '300',
    opacity: 0.5
  },
  startChatButton: {
    width: '88%',
    height: 40,
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: '#757083'
  },
  choseBackgroundColor: {
    width: '88%',
    fontSize: 16,
    fontWeight: '300',
    color: '#757083'
  },
  backgroundColorWrapper: {
    width: '88%',
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  backgroundColor: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    marginLeft: 15
  },
  black: {
    backgroundColor: '#090C08'
  },
  purple: {
    backgroundColor: '#474056'
  },
  gray: {
    backgroundColor: '#8A95A5'
  },
  green: {
    backgroundColor: '#B9C6AE'
  },
});