"use client";
import React, { ReactNode } from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import createButton from "../../../../public/createbutton.png";
import settingsButton from "../../../../public/settingsButton.png";
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
      <div>LOGO</div>
      {props.children}
      <div className={styles.userprofile__container}>
        <label htmlFor="">New Project</label>
        <button
          className={styles.createProjectBtn}
          onClick={() => createProject()}
        >
          <Image
            className={styles.createButton}
            src={createButton}
            placeholder="blur"
            alt=""
          />
        </button>
      </div>
      <div className={styles.collaborator__container}>
        <label htmlFor="">Collaborators</label>
        <button className={styles.collaboratorBtn}></button>
      </div>
      <div className={styles.createproject__container}>
        <p>{props.user.username}</p>
        <Image
          className={styles.UserProfileImage}
          src={profileImage}
          placeholder="blur"
          alt=""
        />
        <button className={styles.settingsButton} onClick={() => signOutUser()}>
          <Image
            className={styles.settingsImage}
            src={settingsButton}
            placeholder="blur"
            alt=""
          />
        </button>
      </div>
    </nav>
  );
};

export default Header;
