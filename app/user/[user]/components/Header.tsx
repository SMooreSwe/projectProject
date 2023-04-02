"use client";
import React, {
  ReactNode,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import settingsButton from "../../../../public/settingsButton.png";
import Image, { StaticImageData } from "next/image";
import { getAuth, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import CreateProject from "../modals/CreateProject";
import CollaboratorsWidget from "../modals/CollaboratorsWidget";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { image } from "html2canvas/dist/types/css/types/image";

const Header = (props: {
  user: { email: string; username: string; userid: string };
  projectid: string;
  projectname: string;
  children: ReactNode;
  collaboratorsArray: string[];
}) => {
  const router = useRouter();

  const [imageSrc, setImageSrc] = useState<string | StaticImageData>(
    "/profileImage.png"
  );

  const userImage = () => {
    const storage = getStorage();
    const filePath = `/users/${props.user.userid}.jpeg`;
    const storageRef = ref(storage, filePath);

    getDownloadURL(storageRef)
      .then((url) => {
        setImageSrc(url);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  function signOutUser() {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}`);
    signOut(getAuth());
  }

  useEffect(() => {
    userImage();
  }, [props.user, props.projectid]);

  const getImage = () => {
    if (imageSrc.toString().length > 0) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.UserProfileImage}
          src={imageSrc as string}
          placeholder="blur"
          alt=""
        />
      );
    } else {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.UserProfileImage}
          src={"/profileImage.png"}
          placeholder="blur"
          alt=""
        />
      );
    }
  };

  return (
    <nav className="Header">
      <div className="header__logo">[project Project]</div>
      <div className="createProject__container">
        {props.children}
        <CreateProject user={props.user} />
      </div>
      <div>
        <CollaboratorsWidget
          projectid={props.projectid}
          username={props.user.username}
          userid={props.user.userid}
          projectname={props.projectname}
          projectcollaborators={props.collaboratorsArray}
        />
      </div>
      <div className={styles.userprofile__container}>
        <p className={styles.userprofile__name}>{props.user.username}</p>
        {imageSrc && <>{getImage()}</>}
        <button className="logoutBtn" onClick={() => signOutUser()}>
          <p className="logoutBtn__text">Logout</p>
        </button>
      </div>
    </nav>
  );
};

export default Header;
