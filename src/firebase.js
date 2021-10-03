import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDEo2EFPmzn2HH3ZnXqirnRO9KoaRuz7YQ",
    authDomain: "datingbuyerssellers.firebaseapp.com",
    databaseURL: "https://datingbuyerssellers-default-rtdb.firebaseio.com",
    projectId: "datingbuyerssellers",
    storageBucket: "datingbuyerssellers.appspot.com",
    messagingSenderId: "845738475476",
    appId: "1:845738475476:web:b61658bb227f682ea1a041"
};
  
firebase.initializeApp(firebaseConfig);

export default firebase;