# AppChat
## Overview

A React-Native project

To run it, first install expo. Run:

### `npm install expo-cli -g`

## Required Libraries

Dependencies, run:

npm install --save @react-native-community/netinfo @types/react-native-keyboard-spacer expo-image-picker expo-location expo-permissions firebase prop-types react react-dom react-native react-native-gesture-handler react-native-gifted-chat react-native-keyboard-spacer react-native-maps react-native-web react-navigation react-navigation-stack

In the project-folder, start the app:

### `npm start`

This will launch your default browser via Expo. If you have already installed the mobile Expo Client App, you can run it on a Smartphone and/or an emulator by either scanning the QR code. Alternatively, if you have already created and signed into your Expo account, you can replicate an iOS Smartphone environment in a browser.</br>

For Android-OS development, visit [this page](https://docs.expo.io/versions/latest/workflow/android-studio-emulator/). Note, you can also "Run on Android device/emulator" via the Expo page which previously opened in your browser. However, for a more realistic Android-OS development environment, downloading and installing the Android Studio is required.

## Firebase 

For storage, set up Firebase account by following these steps: </br>

1. Go [here](https://firebase.google.com/?hl=en)

2. Sign into your Google account</br>

3. Click, "Go to console"</br>

4. Click, "add project"</br>

5. Follow the onscreen instructions by "Creating your project"</br>

6. Click, "Database" on the Develop tab </br>

7. Click, "Create Database" and then, Select, "Start in test mode"</br>

8. Click, "Start collection" and then, Name "Messages" (a possible default suggestion) and then, Select "Auto ID" and, confirm via the following screen</br>

9. Click, Authentication" and, "Set up Sign-in Method" and, enable anonymous authentication</br>

10. Click, "Storage" to set up Cloud Storage</br>

11. Last, Click, Gear (above the Develop tab) and, Select "Project Settings". Click, (towards the) button of the page, Add Firebase to a web app, name and copy all of the text in the firebaseConfig and paste into the Chat.js file.</br>

12. As a back-up, keep the firebaseConfig code in a safe place for reference. </br>

13. The firebaseConfig code for this project cannot be duplicated or re-used for the database storage! 

[Kanban Board](https://trello.com/b/8oSiUtHo/kanban)
