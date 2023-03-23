import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const signUpUser = (email: string, password: string) => { 
    const auth = getAuth();
    createUserWithEmailAndPassword (auth, email, password)
      .then (async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        await addDoc(collection(getFirestore(), 'users'), {
        })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
})}