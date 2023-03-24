"use client";

import React, { useCallback, useRef, useState } from "react";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
} from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getFirebaseConfig, auth } from "../../firebase-config";

export const Form = () => {
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<string>("");
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };
  function authStateObserver(user: any) {
    if (user) {
      // const username = JSON.stringify(getAuth().currentUser?.displayName);
      // router.push(`${process.env.NEXT_PUBLIC_API_URL}user/${username}`);
    }
  }
  function initFirebaseAuth() {
    onAuthStateChanged(getAuth(), authStateObserver);
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  }
  return (
    <div className="login__container">
      <form className="form" onSubmit={handleSubmit}>
        <label className="inputLabel">
          {" "}
          Email:
          <br></br>
          <input
            className="inputField"
            type="email"
            name="email"
            value={inputs.email}
            onChange={handleChange}
          />
        </label>
        <label className="inputLabel">
          {" "}
          Password:
          <br></br>
          <input
            className="inputField"
            type="text"
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
          />
        </label>
        <button className="formButton" type="submit">
          Login
        </button>
      </form>
    </div>);
};