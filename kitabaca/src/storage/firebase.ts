// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8t4BzP4oaoTVQ7opU2lKiXXS4xee1omU",
  authDomain: "storagekitabaca.firebaseapp.com",
  projectId: "storagekitabaca",
  storageBucket: "storagekitabaca.appspot.com",
  messagingSenderId: "353409722613",
  appId: "1:353409722613:web:76f835b5519e1140e63dbc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);