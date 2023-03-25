import React from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="Sidebar">
      <h2>Activity</h2>
      <div className={styles.notification__container}>
        <div className={styles.notification__message}>
          <Image
            className={styles.UserProfileImage}
            src={profileImage}
            placeholder="blur"
            alt=""
          />
          <p>Brittany has invited you to join project lectures</p>
        </div>
        <div className={styles.notification__buttons}>
          <button className={styles.notification__button}>Accept</button>
          <button className={styles.notification__button}>Decline</button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
