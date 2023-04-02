"use client";

import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { app, auth } from "../../firebase-config";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import router from "next/router";

const provider = new GoogleAuthProvider();

export const Form = () => {
  const router = useRouter();
  const db = getFirestore(app) as any;
  const [passwordType, setPasswordType] = useState("password");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const togglePassword = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      return;
    }
    setPasswordType("password");
  };
  
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
  
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = inputs.email;
    const password = inputs.password;
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;
      router.push(`${process.env.NEXT_PUBLIC_API_URL}/user/${user.uid}`);
      return true;
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        setErrorMessage("User not found, please enter a valid email.");
        setTimeout(() => setErrorMessage(""), 2500);
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage(
          "Password is incorrect. Please enter a valid password."
        );
        setTimeout(() => setErrorMessage(""), 2500);
      } else if (email && !password) {
        setErrorMessage("Please input a password");
        setTimeout(() => setErrorMessage(""), 2500);
      } else if (!email && password) {
        setErrorMessage("Please input a valid email");
        setTimeout(() => setErrorMessage(""), 2500);
      }
    }
  };

  return (
    <>
      <div>
        <form className="login-form" onSubmit={handleSubmit}>
          <label className="inputLabel">
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
          <div className="login-form-password-div">
            <label className="inputLabel">
              {" "}
              Password:
              <br></br>
              <input
                className="inputField inputField--password"
                type={passwordType}
                name="password"
                value={inputs.password || ""}
                onChange={handleChange}
              />
              <button
                className="login-form__password-visibility"
                onClick={togglePassword}
              >
                {passwordType === "password" ? (
                  <AiOutlineEye size={20} />
                ) : (
                  <AiOutlineEyeInvisible size={20} />
                )}
              </button>
            </label>
          </div>
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
      <button className="formButton" onClick={() => googleSignIn()}>Sign in with Google</button>
    </>
  );
};
