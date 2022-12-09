import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs,  } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// isikan firebaseConfig disini
const firebaseConfig = {
    apiKey: "AIzaSyC9AOQv6LEpF5O8HEuOyZbBdq3ke6EcEPM",
    authDomain: "hafozh-dfdbb.firebaseapp.com",
    projectId: "hafozh-dfdbb",
    storageBucket: "hafozh-dfdbb.appspot.com",
    messagingSenderId: "489628069659",
    appId: "1:489628069659:web:ad50dddc10db19b0b6adbe",
    measurementId: "G-RKFCFR85XW"
};

const firebaseApp = firebase.initializeApp(firebaseConfig); 

export default firebaseApp.firestore();
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);



