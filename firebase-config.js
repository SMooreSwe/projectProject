// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAmJA3Cf12-NH8YYuqs1JZAMDK0u_xPwIo",
  authDomain: "project-project-3e46d.firebaseapp.com",
  projectId: "project-project-3e46d",
  storageBucket: "project-project-3e46d.appspot.com",
  messagingSenderId: "736188356525",
  appId: "1:736188356525:web:320a80ec7d49c39921f324",
  measurementId: "G-BWJH7VWMNC",
};

export function getFirebaseConfig() {
  if (!firebaseConfig || !firebaseConfig.apiKey) {
    throw new Error(
      "No Firebase configuration object provided." +
        "\n" +
        "Add your web app's configuration object to firebase-config.js"
    );
  } else {
    return firebaseConfig;
  }
}

export const app = initializeApp(firebaseConfig);
// Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
const db = getFirestore();
