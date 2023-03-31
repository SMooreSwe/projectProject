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
import { validate } from "uuid";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export const Form = () => {
  const router = useRouter();
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  function authStateObserver(user: any) {
    if (user) {
      router.push(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.uid}`);
    }
  }

  function initFirebaseAuth() {
    onAuthStateChanged(getAuth(), authStateObserver);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputs.password === inputs.confirmpassword) {
      createUserWithEmailAndPassword(auth, inputs.email, inputs.password).then(
        async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          const data = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
            {
              cache: "no-store",
              method: "POST",
              headers: {
                "Content-type": "application/json; charset=UTF-8",
              },
              body: JSON.stringify({
                username: inputs.username,
                email: inputs.email,
                userid: user.uid,
              }),
            }
          );
          const response = await data;
          initFirebaseAuth();
          const userid = await response.json();
          if (image) {
            const storage = getStorage();
            const filePath = `/users/${userid}.jpeg`;
            const storageRef = ref(storage, filePath);
            uploadBytes(storageRef, file).then((snapshot) => {
              console.log("Uploaded a blob or file!");
            });
          }
          return response;
        }
      ).catch((error: any) => {
        console.log(error.code, error.message);
        if (!error?.response) {
          setErrorMessage('No server response')
        } else if (error.code === 'auth/internal-error') {
          setErrorMessage('Please enter a password.')
        } else if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('This email is already in use. Please enter a different one.');
        } else {
          setErrorMessage('Something went wrong. Try again.');
        };
      });
    }
  };

  const uploadedImageName = useRef<HTMLParagraphElement>(null);
  const userImage = useRef<HTMLDivElement>(null);
  const handleImage = (files: FileList | null) => {
    if (files) {
      const fileRef = files[0];
      const fileType: string = fileRef.type || "";
      if (fileType ==='image/jpeg') {
        userImage.current?.classList.remove("hidden");
        const reader = new FileReader();
        reader.readAsBinaryString(fileRef);
        reader.onload = (ev: any) => {
          uploadedImageName.current!.innerHTML = files[0].name;
          setFile(files[0]);
          setImage(`data:${fileType};base64,${btoa(ev.target.result)}`);
        };
      } else {
        console.log('only jpeg!')
      }
    }
  };

  return (
    <div>
      <div className="signup__container">
        <div className="profileimage__container">
          <div ref={userImage} className="profileimage__button hidden">
            <img className="image" src={image} />
          </div>
          <div className="selectImage__container">
            <label className="custom-file-upload">
              <input
                type="file"
                onChange={(e) => handleImage(e.target.files)}
              />
              Choose image
            </label>
            <p className="profileimage__caption" ref={uploadedImageName}>Select a Profile Image (Optional)</p>
          </div>
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
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={inputs.password || ""}
              onChange={handleChange}
            />
             <button className="formSignupPasswordVisibility" onClick={togglePasswordVisibility}>
          {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20}/>}
        </button>
          </label>
          <label className="inputLabel">
            {" "}
            Confirm Password:
            <br></br>
            <input
              className="inputField"
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmpassword"
              value={inputs.confirmpassword || ""}
              onChange={handleChange}
            />
             <button className="formSignupConfirmPasswordVisibility" onClick={toggleConfirmPasswordVisibility}>
          {showConfirmPassword ? < AiOutlineEyeInvisible size={20}/> : <AiOutlineEye size={20}/>}
        </button>
          </label>
          {errorMessage && (
            <div className="error__container">
              <p className="error__text">{errorMessage}</p>
            </div>
          )}
          <button className="formButton" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
