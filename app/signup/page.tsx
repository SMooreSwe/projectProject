import React from "react";
import { Form } from "./components/SignUpForm";

const Signup = () => {
  return (
    <>
      <div className="signup__main-container">
        <h1 className="signup__title"> [project Project]</h1>
        <p className="signup__subtitle">Please create an account</p>
      </div>
      <Form />
    </>
  );
};

export default Signup;
