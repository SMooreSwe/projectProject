import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { Form } from './components/Form'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
    <header>
      <Link href='/about'>Learn about us here</Link>
    </header>
    <main className={styles.main}>
      <h1>[project Project]</h1>
      <h3>Login with your email and password</h3>
      <Form/>
      <Link href='/signup'>Not got an account? Click here to sign up</Link>
    </main>
    </>
  )
}
