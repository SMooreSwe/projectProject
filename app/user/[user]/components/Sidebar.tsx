import React from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import Image from "next/image";

const Sidebar = () => {
  return (
    <div className="Sidebar">
      <h3>Activity</h3>
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
      <div>
        <h3>History</h3>
      </div>
      <div>
        <h3>Tutorial</h3>
      </div>
    </div>
  );
};

export default Sidebar;
