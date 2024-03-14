// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC15wpMuMlbNUUAtUGLlBDiuY0O8nuv4hc",
  authDomain: "bunnies-social.firebaseapp.com",
  projectId: "bunnies-social",
  storageBucket: "bunnies-social.appspot.com",
  messagingSenderId: "561272399161",
  appId: "1:561272399161:web:6b8dcfce915191905674e8",
  measurementId: "G-2NLVXCSBR3",
  databaseURL: "https://bunnies-social-default-rtdb.europe-west1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
export const database = getDatabase(app);