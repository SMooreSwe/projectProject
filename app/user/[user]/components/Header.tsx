"use client";
import React, { ReactNode } from "react";
import styles from "../userpage.module.css";
import image from "../../../../public/collaborator.png";
import Image from "next/image";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

const Header = (props: {
  user: { email: string; username: string };
  children: ReactNode;
}) => {
  const router = useRouter();

  function signOutUser() {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}`);
    signOut(getAuth());
  }

  function createProject() {}

  return (
    <nav className="Header">
      {props.children}
      <div>
        <label htmlFor="">New Project</label>
        <button onClick={() => createProject()}>+</button>
      </div>
      <div>
        <label htmlFor="">Collaborators</label>
        <button>imgHere</button>
      </div>
      <div className={styles.Header__UserProfile}>
        <p>{props.user.username}</p>
        <Image
          className={styles.UserProfileImage}
          src={image}
          placeholder="blur"
          alt=""
        />
        <button onClick={() => signOutUser()}>Log out</button>
      </div>
    </nav>
  );
};

export default Header;
