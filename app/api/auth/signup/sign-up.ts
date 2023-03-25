import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  FieldValue,
} from "firebase/firestore";
import { getFirebaseConfig, app } from "../../../../firebase-config";
import { v4 } from "uuid";

const db = getFirestore(app) as any;
const signUpUser = async (username: string, email: string, userid: string) => {
  await setDoc(doc(db, "users", `${userid}`), {
    username,
    email,
  });
  return userid;
};

const serviceAccount = require("../../../../project-project-3e46d-firebase-adminsdk-v3er7-a29f526e72.json");
const completed = Object.assign(serviceAccount, {
  private_key: `${process.env.FB_ADMIN_PRIVATE_KEY}`,
  client_x509_cert_url: `${process.env.FB_CERT_URL}`,
  auth_provider_x509_cert_url: `${process.env.FB_PROVIDER_URL}`,
  client_id: `${process.env.FB_CLIENT_ID}`,
  private_key_id: `${process.env.FB_PRIVATE_KEY_ID}`,
});

const config = getFirebaseConfig() as any;
config.credential = cert(completed);

if (!getApp()) {
  initializeApp(config);
}

export { signUpUser };
