"use client";
import React, { ReactNode, useEffect, useReducer, useRef, useState } from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import settingsButton from "../../../../public/settingsButton.png";
import Image, { StaticImageData } from "next/image";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import CreateProject from "../modals/CreateProject";
import CollaboratorsWidget from "../modals/CollaboratorsWidget";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

const Header = (props: {
  user: { email: string; username: string; userid: string };
  projectid: string;
  projectname: string;
  children: ReactNode;
}) => {
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState<string | StaticImageData>("/profileImage.png")

  const imageSRC = useRef<HTMLImageElement>(null)

  const userImage = () => {
      const storage = getStorage();
      const filePath = `/users/${props.user.userid}.jpeg`;
      const storageRef = ref(storage, filePath);
    
       getDownloadURL(storageRef).then(url => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          const blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();
        setImageSrc(url)
      })
      .catch((error) => {
        console.log(error)
      });
  }

  function signOutUser() {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}`);
    signOut(getAuth());
  }

  useEffect(() => {
    userImage();
  },[props.user])

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
        <CollaboratorsWidget projectid={props.projectid} username={props.user.username} projectname={props.projectname} />
      </div>
      <div className={styles.userprofile__container}>
        <p className={styles.userprofile__name}>{props.user.username}</p>
        <img
          ref={imageSRC}
          className={styles.UserProfileImage}
          src={imageSrc as string}
          placeholder="blur"
          alt=""
        />
        <button className={styles.settingsButton} onClick={() => signOutUser()}>
          <Image
            className={styles.settingsImage}
            src={settingsButton}
            placeholder="blur"
            alt="hamburger menu"
          />
        </button>
      </div>
    </nav>
  );
};

export default Header;
