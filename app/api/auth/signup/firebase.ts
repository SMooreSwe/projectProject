export {};

// import { initializeApp, applicationDefault, cert } from "firebase-admin/app";
// import { getApp } from "firebase/app";
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// import {
//   getFirestore,
//   collection,
//   addDoc,
//   FieldValue,
// } from "firebase/firestore";
// import { getFirebaseConfig, auth, app } from "../../../../firebase-config";
// import { v4 } from "uuid";

// // ------------------------- UPDATE DOCUMENT -------------------------------
// const db = getFirestore(app) as any;
// import {
//   doc,
//   updateDoc,
//   setDoc,
//   arrayUnion,
//   arrayRemove,
//   increment,
//   deleteDoc,
//   deleteField,
// } from "firebase/firestore";

// const UpdateDocument = async () => {
//   const washingtonRef = doc(db, "cities", "DC");
//   await updateDoc(washingtonRef, {
//     capital: true,
//   });
// };

// // ------------------------- UPDATE FIELDS IN DOCUMENT -------------------------------
// const updateFields = async () => {
//   const frankDocRef = doc(db, "users", "frank");
//   await setDoc(frankDocRef, {
//     name: "Frank",
//     favorites: { food: "Pizza", color: "Blue", subject: "recess" },
//     age: 12,
//   });
//   // To update age and favorite color:
//   await updateDoc(frankDocRef, {
//     age: 13,
//     "favorites.color": "Red",
//   });
// };

// // ------------------------- ADD TO ARRAY  -------------------------------

// const AddToArray = async () => {
//   const washingtonRef = doc(db, "cities", "DC");
//   await updateDoc(washingtonRef, {
//     regions: arrayUnion("greater_virginia"),
//   });
// };

// // ------------------------- REMOVE  FROM ARRAY  -------------------------------
// const RemoveFromArray = async () => {
//   const washingtonRef = doc(db, "cities", "DC");
//   await updateDoc(washingtonRef, {
//     regions: arrayRemove("east_coast"),
//   });
// };

// // ------------------------- INCREMENT VALUE  -------------------------------
// const IncrementValue = async () => {
//   const washingtonRef = doc(db, "cities", "DC");
//   await updateDoc(washingtonRef, {
//     population: increment(1),
//   });
// };

// // ------------------------- DELETE DOCUMENT  -------------------------------
// const deleteDocument = async () => {
//   await deleteDoc(doc(db, "cities", "DC"));
// };

// // ------------------------- DELETE FIELD  -------------------------------
// const deleteFields = async () => {
//   const cityRef = doc(db, "cities", "Baja");
//   await updateDoc(cityRef, {
//     capital: deleteField(),
//   });
// };

// const serviceAccount = require("../../../../project-project-3e46d-firebase-adminsdk-v3er7-a29f526e72.json");
// const completed = Object.assign(serviceAccount, {
//   private_key: `${process.env.FB_ADMIN_PRIVATE_KEY}`,
//   client_x509_cert_url: `${process.env.FB_CERT_URL}`,
//   auth_provider_x509_cert_url: `${process.env.FB_PROVIDER_URL}`,
//   client_id: `${process.env.FB_CLIENT_ID}`,
//   private_key_id: `${process.env.FB_PRIVATE_KEY_ID}`,
// });

// const config = getFirebaseConfig() as any;
// config.credential = cert(completed);

// if (!getApp()) {
//   initializeApp(config);
// }

// export { addData };
