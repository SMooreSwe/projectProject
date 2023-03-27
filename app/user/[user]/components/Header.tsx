"use client";
import React, { ReactNode } from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import settingsButton from "../../../../public/settingsButton.png";
import Image from "next/image";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import CreateProject from "../modals/CreateProject";
import CollaboratorsWidget from "../modals/CollaboratorsWidget";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const Header = (props: {
  user: { email: string; username: string; userid: string };
  projectid: string;
  children: ReactNode;
}) => {
  const router = useRouter();


  const userImage = () => {
      const storage = getStorage();
      const filePath = `/users/${props.user.userid}.jpeg`;
      const storageRef = ref(storage, filePath);

       getDownloadURL(storageRef).then(url => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
          console.log(blob)
        };
        xhr.open('GET', url);
        xhr.send();

        console.log(url)
        return url
      })
      .catch((error) => {
        console.log(error)
        return profileImage

      });
  }

  const image = userImage()

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
        <CollaboratorsWidget projectid={props.projectid} />
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
