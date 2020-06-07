import React, { Component } from 'react';
// Import React native components 
import { StyleSheet, Text, View } from 'react-native';

// Create screen #2 
export default class Chat extends Component {

  // Navigation bar title
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.state.params.userName,
    };
  };
  // Render app components
  render() {
    return (
      // Fullscreen component
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: this.props.navigation.state.params.backgroundColor }}>
        <Text>Screen 2 Greetings!</Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({

});
