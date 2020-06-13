import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ScrollView } from 'react-native';

// Import React Navigation
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// Import screens from the Components folder
import Start from './components/Start.js';
import Chat from './components/Chat.js';

import { decode, encode } from 'base-64';
if (!global.btoa) { global.btoa = encode }
if (!global.atob) { global.atob = decode }

// Create App Navigator
const navigator = createStackNavigator({
  Start: {
    screen: Start,
    navigationOptions: {
      header: null
    }
  },
  Chat: { screen: Chat }
});

const navigatorContainer = createAppContainer(navigator);

// Export Root Component 
export default navigatorContainer;
