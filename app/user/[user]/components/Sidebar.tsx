import React, { useEffect, useState } from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import Image from "next/image";
import { User } from "firebase/auth";
import { Invited } from "../../../Types";
import { collection, getFirestore, onSnapshot, query, serverTimestamp, Timestamp } from "firebase/firestore";
import { app } from "../../../../firebase-config";

const Sidebar = (props: {
  user: { email: string; username: string; userid: string }}) => {
  const [inviteduser, setInvitedUSer] = useState<Invited[]>([]);

  const db = getFirestore(app) as any;

  const getInvited = async () => {
    const docRef = query(
      collection(db, "notifications", props.user.userid, "usernotifications"),
    );
    onSnapshot(docRef, (querySnapshot) => {
      let data = [] as any[];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setInvitedUSer(data);
    });
  };

  useEffect(() => {
    getInvited()
    console.log('IS THIS WORKING?')
  }, [props.user]);

  const userInvited = () => {
    return (
      <>
        <h3 className={styles.Sidebar__title}>Activity</h3>
        {inviteduser && inviteduser.map((user: Invited) => {
          
            return (
              <div key={ user.projectname } className={styles.notification__container}>
                <div className={styles.notification__message}>
                  <Image
                    className={styles.UserProfileImage}
                    src={profileImage}
                    placeholder="blur"
                    alt=""
                  />
                  <p>{user.userinviting} has invited you to join project {user.projectname}</p>
                </div>
                <div className={styles.notification__buttons}>
                  <button className={styles.notification__button}>Accept</button>
                  <button className={styles.notification__button}>Decline</button>
                </div>
              </div>
            )
        })}
      </>
    )
  }

  return (
    <div className="Sidebar">
      {inviteduser && ( <>
          {userInvited()}
         </>
        )}
      <div>
        <h3 className={styles.Sidebar__title}>History</h3>
      </div>
      <div>
        <h3 className={styles.Sidebar__title}>Tutorial</h3>
      </div>
    </div>
  );
};

export default Sidebar;
