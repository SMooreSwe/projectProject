import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
import { getApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getFirebaseConfig, auth } from "../../../firebase-config";
import { v4 } from "uuid";

const signUpUser = async (username: string, email: string) => {
  const userid = v4();
  await addDoc(collection(getFirestore(getApp()), "users"), {
    user_id: userid,
    username,
    email,
  }).catch((error) => {
    console.log(error.code, error.message);
  });
  return userid;
};

const serviceAccount = require("../../../project-project-3e46d-firebase-adminsdk-v3er7-3377056e88.json");

const config = getFirebaseConfig() as any;
config.credential = cert(serviceAccount);

if (!getApp()) {
  initializeApp(config);
}

export { signUpUser };
