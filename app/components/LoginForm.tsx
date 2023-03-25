"use client";

import {
  onAuthStateChanged,
  getAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { auth } from "../../firebase-config";

export const Form = () => {
  const router = useRouter();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

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
    </div>
  );
};
