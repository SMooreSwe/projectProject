"use client";

import React, { useState } from "react";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getFirebaseConfig, auth } from "../../../firebase-config";

const Form = () => {
  const router = useRouter();
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  function authStateObserver(user) {
    if (user) {
      const username = JSON.stringify(getAuth().currentUser?.displayName);
      router.push(`http://localhost:3000/user/${username}`);
    }
  }
  function initFirebaseAuth() {
    onAuthStateChanged(getAuth(), authStateObserver);
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createUserWithEmailAndPassword(auth, inputs.email, inputs.password).then(
      async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log(user);

        const data = await fetch("http://localhost:3000/api/auth", {
          cache: "no-store",
          method: "POST",
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
          body: JSON.stringify({
            username: inputs.username,
            email: inputs.email,
          }),
        });
        const response = await data;
        //initFirebaseAuth();
        return response;
      }
    );
  };

  const googleAuthentication = async (e: React.FormEvent) => {
    e.preventDefault();
    var provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        {" "}
        Username:
        <input
          type="text"
          name="username"
          value={inputs.username}
          onChange={handleChange}
        />
      </label>
      <label>
        {" "}
        Email:
        <input
          type="text"
          name="email"
          value={inputs.email}
          onChange={handleChange}
        />
      </label>
      <label>
        {" "}
        Password:
        <input
          type="text"
          name="password"
          value={inputs.password || ""}
          onChange={handleChange}
        />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};
export default Form;
