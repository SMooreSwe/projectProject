import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getFirebaseConfig, auth } from "../../../firebase-config";

let app;
let oApp;

const signUpUser = async (username: string, email: string) => {
  await addDoc(collection(getFirestore(getApp()), "users"), {
    user_id: 123,
    username,
    email,
  }).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(error);
  });
  console.log("signUpUser is working.....?");
};

const serviceAccount = require("../../../project-project-3e46d-firebase-adminsdk-v3er7-3377056e88.json");

if (!app) {
  app = initializeApp(
    {
      credential: cert(serviceAccount),
    },
    "b/end"
  );
}

if (!oApp) {
  oApp = initializeApp(getFirebaseConfig(), "backend-Options");
}

export { signUpUser };
