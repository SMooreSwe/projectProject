"use client";

import {
  onAuthStateChanged,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../../firebase-config";
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai'

export const Form = () => {
  const router = useRouter();
  const [passwordType, setPasswordType] = useState("password");
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
     setPasswordType("text")
     return;
    } setPasswordType("password")
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
      return { error: error.message };
    }
  };
  return (
    <div>
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
        {/* <div className="password-div"> */}
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
          <button className="formPasswordVisibility" onClick={togglePassword}>
          {passwordType==="password" ? <AiOutlineEye size={20} /> : <AiOutlineEyeInvisible size={20}/>}
        </button>
        </label>
        
        {/* </div> */}
        <button className="formButton" type="submit">
          Login
        </button>
      </form>
    </div>
  );
};
