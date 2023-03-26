"use client";
import React, { ReactNode } from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import settingsButton from "../../../../public/settingsButton.png";
import Image from "next/image";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import CreateProject from "../modals/CreateProject";

const Header = (props: {
  user: { email: string; username: string; userid: string };
  children: ReactNode;
}) => {
  const router = useRouter();

  function signOutUser() {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}`);
    signOut(getAuth());
  }

  return (
    <nav className="Header">
      <div className="Logo">[project Project]</div>
      {props.children}
      <div className={styles.createproject__container}>
        <label htmlFor="">New Project</label>
        <CreateProject user={props.user} />
      </div>
      <div className={styles.collaborator__container}>
        <label htmlFor="">Collaborators</label>
        <button className={styles.collaboratorBtn}></button>
      </div>
      <div className={styles.userprofile__container}>
        <p className={styles.userprofile__name}>{props.user.username}</p>
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
