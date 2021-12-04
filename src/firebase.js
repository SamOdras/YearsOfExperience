import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/storage";
import "firebase/compat/database";

var firebaseConfig = {
  apiKey: "AIzaSyC3r3Nno8H83z4Ce_8wUirkCZrSeSlwagI",
  authDomain: "cari-kos-user.firebaseapp.com",
  databaseURL: "https://cari-kos-user.firebaseio.com",
  projectId: "cari-kos-user",
  storageBucket: "cari-kos-user.appspot.com",
  messagingSenderId: "234563847804",
  appId: "1:234563847804:web:f24eea66034fcc47bdabf9",
  measurementId: "G-WL1LRM2RW5"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);


export default firebase;
