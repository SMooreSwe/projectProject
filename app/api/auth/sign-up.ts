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
};

const serviceAccount = require("../../../project-project-3e46d-firebase-adminsdk-v3er7-a29f526e72.json");
const completed = Object.assign(serviceAccount, {
  private_key: `${process.env.FB_ADMIN_PRIVATE_KEY}`, 
  client_x509_cert_url:`${process.env.FB_CERT_URL}`, 
  auth_provider_x509_cert_url: `${process.env.FB_PROVIDER_URL}`,
  client_id: `${process.env.FB_CLIENT_ID}`,
  private_key_id: `${process.env.FB_PRIVATE_KEY_ID}`})

if (!app) {
  app = initializeApp(
    {
      credential: cert(completed),
    },
    "b/end"
  );
}

if (!oApp) {
  oApp = initializeApp(getFirebaseConfig(), "backend-Options");
}

export { signUpUser };
