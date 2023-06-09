import { Form } from "./components/LoginForm";
import Link from "next/link";
import "./globals.css";

export default function Home() {
  return (
    <>
      <main className="login__main-container">
        <h1 className="login__title">[project Project]</h1>
        <p className="login__subtitle">Login with your email and password.</p>
        <Form />
        <section className="login__container-more-info-section">
          <p className="more-info__signup">
            Dont have an account? Click{" "}
            <Link className="login__message link" href="/signup">
              here
            </Link>{" "}
            to sign up.
          </p>
          <p>
            Learn more about us{" "}
            <Link href="/about" className="link">
              here
            </Link>
            .
          </p>
        </section>
      </main>
    </>
  );
}
