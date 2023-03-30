import { Form } from "./components/LoginForm";
import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <>
      <main className="form main">
        <h1 className="login__title">[project Project]</h1>
        <p className="login__subtitle">Login with your email and password.</p>
        <Form />
        <Link className="login__message link" href="/signup">
          Dont have an account? Click <a href="/signup">here</a> to sign up.
        </Link>
        <Link href="/about" className="link">
            Learn more about us <a href="/about">here</a>.
        </Link>
      </main>
    </>
  );
}
