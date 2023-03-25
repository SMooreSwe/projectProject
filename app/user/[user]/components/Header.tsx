"use client";
import React, { ReactNode } from "react";
import styles from "../userpage.module.css";

const Header = (props: {
  user: { email: string; username: string };
  children: ReactNode;
}) => {
  return (
    <nav className={styles.Header}>
      {props.children}
      <div>
        <label htmlFor="">New Project</label>
        <button>+</button>
      </div>
      <div>
        <label htmlFor="">Collaborators</label>
        <button>imgHere</button>
      </div>
      <div className={styles.Header__UserProfile}>
        <p>{props.user.username}</p>
        <img
          className={styles.UserProfileImage}
          src="collaborator.png"
          alt=""
        />
        <button>Settings</button>
      </div>
    </nav>
  );
};

export default Header;
