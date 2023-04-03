"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { app, auth } from "../../../firebase-config";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";

export const Form = () => {
  const router = useRouter();
  const provider = new GoogleAuthProvider();
  const db = getFirestore(app) as any;
  const [image, setImage] = useState<string>("");
  const [file, setFile] = useState<any>();
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [jpegImgOnlyMessage, setJpegImgOnlyMessage] = useState<string>("");
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const googleSignIn = () => {
    signInWithPopup(auth, provider).then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    const docRef = doc(db, "users", `${user.uid}`);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        router.push(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.uid}`);
        } else {
          await setDoc(docRef, {
            email: user.email,
            userid: user.uid,
            projects:'',
            username: user.displayName,
          })
          router.push(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.uid}`);
        }
      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

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

    if (inputs.username !== '' && inputs.password === inputs.confirmpassword) {
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
        if (error.code === 'auth/weak-password') {
          setErrorMessage('Password should be at least 6 characters.')
          setTimeout(() => setErrorMessage(''), 2500)
        } else if (error.code === 'auth/internal-error') {
          setErrorMessage('Please enter a password.')
          setTimeout(() => setErrorMessage(''), 2500)
        } else if (error.code === 'auth/email-already-in-use') {
          setErrorMessage('This email is already in use. Please enter a different one.')
        }});
        setTimeout(() => setErrorMessage(''), 2500)
    } else if (inputs.password !== inputs.confirmpassword) {
      setErrorMessage('Passwords do not match.')
      setTimeout(() => setErrorMessage(''), 2500)
    } else if (inputs.username === '') {
      setErrorMessage('Please input a username ')
      setTimeout(() => setErrorMessage(''), 2500)
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
        setJpegImgOnlyMessage('Please upload a JPEG image file.');
        setTimeout(() => setJpegImgOnlyMessage(""), 2500);
      }
    }
  };

  return (
    <div>
      <div className="signup-form__container">
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
          {jpegImgOnlyMessage && (
            <div className="error__container">
              <p className="error__text">{jpegImgOnlyMessage}</p>
            </div>
          )}
        </div>
        <form className="signup-form" onSubmit={handleSubmit}>
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
          <div className="signup-form-password-div">
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
              <i className="signup-form__password-visibility" onClick={togglePasswordVisibility}>
                {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20}/>}
              </i>
            </label>
          </div>            
          <div className="signup-form-password-div">
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
              <i className="signup-form__password-visibility" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? < AiOutlineEyeInvisible size={20}/> : <AiOutlineEye size={20}/>}
              </i>
            </label>
          </div>
          {errorMessage && (
            <div className="error__container">
              <p className="error__text">{errorMessage}</p>
            </div>
          )}
          <button className="formButton" type="submit">
            Sign Up
          </button>
        </form>
        <div className="google-signin">
          <button className="formButton signup-google-btn" onClick={() => googleSignIn()}><FcGoogle className="login-google-icon" size={20} /> Sign up with Google</button>
        </div>
      </div>
    </div>
  );
};
