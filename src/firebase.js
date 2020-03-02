import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

var firebaseConfig = {
  apiKey: "AIzaSyAihQpNXEEKv_Zn5SOxChU8QoK6-DL5eMg",
  authDomain: "react-slack-clone-6aeed.firebaseapp.com",
  databaseURL: "https://react-slack-clone-6aeed.firebaseio.com",
  projectId: "react-slack-clone-6aeed",
  storageBucket: "gs://react-slack-clone-6aeed.appspot.com",
  messagingSenderId: "482835104436",
  appId: "1:482835104436:web:dd1705d83a105c0de40de1",
  measurementId: "G-9WE9ZLT3Z2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase