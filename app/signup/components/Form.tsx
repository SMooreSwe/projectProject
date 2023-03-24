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
import { getFirebaseConfig, auth } from "../../../firebase-config";

export const Form = () => {
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<string>("");
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
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

    if (inputs.password === inputs.confirmpassword) {
      console.log(process.env.NEXT_PUBLIC_API_URL);
      createUserWithEmailAndPassword(auth, inputs.email, inputs.password).then(
        async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          // console.log(user);

          const data = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth`,
            {
              cache: "no-store",
              method: "POST",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
              body: JSON.stringify({
                username: inputs.username,
                email: inputs.email,
              }),
            }
          );
          const response = await data;
          initFirebaseAuth();
          const userid = await response.json();

          // // ATTEMPTING TO UPLOAD IMAGE TO FIRESTORE STORAGE!!!!!!!!!!
          if (image) {
            const storage = getStorage();
            const filePath = `/users/${userid}.jpeg`;
            const storageRef = ref(storage, filePath);

            // 'file' comes from the Blob or File API
            // uploadBytes(storageRef, file).then((snapshot) => {
            //   console.log("Uploaded a blob or file!");
            // });
          }
          return response;
        }
      );
    }
  };

  const userImage = useRef<HTMLDivElement>(null);
  const handleImage = (files: FileList | null) => {
    if (files) {
      userImage.current?.classList.remove("hidden");
      const fileRef = files[0];
      const fileType: string = fileRef.type || "";
      // setFile(fileRef);

      const reader = new FileReader();
      reader.readAsBinaryString(fileRef);
      reader.onload = (ev: any) => {
        // console.log(ev.target.result);

        setFile(ev.target.result);
        setImage(`data:${fileType};base64,${btoa(ev.target.result)}`);
      };
    }
  };

  // const googleAuthentication = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   var provider = new GoogleAuthProvider();
  //   signInWithPopup(auth, provider).then(async (userCredential) => {
  //     // Signed in
  //     const user = userCredential.user;
  //     console.log(user);
  //   });
  // };

  return (
    <div className="signup__container">
      <div className="profileimage__container">
        <div ref={userImage} className="profileimage__button hidden">
          <img className="image" src={image} />
        </div>
        <input type="file" onChange={(e) => handleImage(e.target.files)} />
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <label className="inputLabel">
          {" "}
          Username:
          <br></br>
          <input
            className="inputField"
            type="text"
            name="username"
            value={inputs.username}
            onChange={handleChange}
          />
        </label>
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
        <label className="inputLabel">
          {" "}
          Confirm Password:
          <br></br>
          <input
            className="inputField"
            type="text"
            name="confirmpassword"
            value={inputs.confirmpassword || ""}
            onChange={handleChange}
          />
        </label>

        <button className="formButton" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};
