import { Inter } from "next/font/google";
import styles from "./page.module.css";
import { Form } from "./components/LoginForm";
import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <>
      <main className="form">
        <h1 className="login__title">[project Project]</h1>
        <p className="login__subtitle">Login with your email and password</p>
        <Form />
        <Link className="login__message link" href="/signup">
          Dont have an account? Click here to sign up
        </Link>
      </main>
      <footer>
        <Link href="/about" className="link">
            Learn more about us here.
        </Link>
      </footer>
    </>
  );
}
