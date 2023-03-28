import React, { useEffect, useState } from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import Image from "next/image";
import { User } from "firebase/auth";
import { Invited } from "../../../Types";
import { arrayRemove, arrayUnion, collection, deleteDoc, doc, getFirestore, onSnapshot, query, serverTimestamp, Timestamp, updateDoc } from "firebase/firestore";
import { app } from "../../../../firebase-config";
import { uuid } from "uuidv4";

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
  }, [props.user]);

  const AcceptProject = async (e: any) => {
    const array = e.target.value
    const arraySplit = array.split(',')
    const projectid = arraySplit[0]
    const invitationuid = arraySplit[1]

    console.log(projectid)
    console.log(invitationuid)

    const projectRef = doc(db, "projects", projectid);
    await updateDoc(projectRef, {
      users: arrayUnion(props.user.userid),
    });
    const userRef = doc(db, "users", props.user.userid);
    await updateDoc(userRef, {
      projects: arrayUnion(projectid),
    });
    await deleteDoc(doc(db, "notifications", props.user.userid, "usernotifications", invitationuid));
  };

  const DeclineProject = async (e: any) => {
    const invitationuid = e.target.value
    await deleteDoc(doc(db, "notifications", props.user.userid, "usernotifications", invitationuid));
  };

  const userInvited = () => {
    return (
      <>
        <h3 className={styles.Sidebar__title}>Activity</h3>
        {inviteduser && inviteduser.map((invitation: Invited) => {
          
            return (
              <div key={ invitation.projectname } className={styles.notification__container}>
                <div className={styles.notification__message}>
                  <Image
                    className={styles.UserProfileImage}
                    src={profileImage}
                    placeholder="blur"
                    alt=""
                  />
                  <p>{invitation.userinviting} has invited you to join project {invitation.projectname}</p>
                </div>
                <div className={styles.notification__buttons}>
                  <button value={[invitation.projectid, invitation.invitationuid]} onClick={AcceptProject} className={styles.notification__button}>Accept</button>
                  <button value={invitation.invitationuid} onClick={DeclineProject} className={styles.notification__button}>Decline</button>
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
