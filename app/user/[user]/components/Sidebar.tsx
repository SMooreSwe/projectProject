import React, { useEffect, useState } from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import Image from "next/image";
import { User } from "firebase/auth";
import { Invited } from "../../../Types";
import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../../../firebase-config";
import { uuid } from "uuidv4";
import createButton from "../../../../public/createbutton.png";
import { Project } from "../../../Types";

const Sidebar = (props: {
  user: { email: string; username: string; userid: string };
  projectlist: Project[];
}) => {
  const [inviteduser, setInvitedUSer] = useState<Invited[]>([]);

  const db = getFirestore(app) as any;

  const getInvited = async () => {
    if (props.user.userid) {
      const docRef = query(
        collection(db, "notifications", props.user.userid, "usernotifications")
      );
      onSnapshot(docRef, (querySnapshot) => {
        let data = [] as any[];
        querySnapshot.forEach((doc) => {
          data.push(doc.data());
        });
        setInvitedUSer(data);
      });
    }
  };

  useEffect(() => {
    getInvited();
  }, [props.user, props.projectlist]);

  const AcceptProject = async (e: any) => {
    const array = e.target.value;
    const arraySplit = array.split(",");
    const projectid = arraySplit[0];
    const invitationuid = arraySplit[1];

    console.log(projectid);
    console.log(invitationuid);

    const projectRef = doc(db, "projects", projectid);
    await updateDoc(projectRef, {
      users: arrayUnion(props.user.userid),
    });
    const userRef = doc(db, "users", props.user.userid);
    await updateDoc(userRef, {
      projects: arrayUnion(projectid),
    });
    await deleteDoc(
      doc(
        db,
        "notifications",
        props.user.userid,
        "usernotifications",
        invitationuid
      )
    );
  };

  const DeclineProject = async (e: any) => {
    const invitationuid = e.target.value;
    await deleteDoc(
      doc(
        db,
        "notifications",
        props.user.userid,
        "usernotifications",
        invitationuid
      )
    );
  };

  const userInvited = () => {
    let title = "";
    if (inviteduser.length > 0) {
      title = "Activity";
    }
    return (
      <>
        <h3 className={styles.Sidebar__title}>{title}</h3>
        {inviteduser &&
          inviteduser.map((invitation: Invited) => {
            return (
              <div
                key={invitation.projectname}
                className={styles.notification__container}
              >
                <div className={styles.notification__message}>
                  <Image
                    className={styles.UserProfileImage}
                    src={profileImage}
                    placeholder="blur"
                    alt=""
                  />
                  <p>
                    {invitation.userinviting} has invited you to join project{" "}
                    {invitation.projectname}
                  </p>
                </div>
                <div className={styles.notification__buttons}>
                  <button
                    value={[invitation.projectid, invitation.invitationuid]}
                    onClick={AcceptProject}
                    className={styles.notification__button}
                  >
                    Accept
                  </button>
                  <button
                    value={invitation.invitationuid}
                    onClick={DeclineProject}
                    className={styles.notification__button}
                  >
                    Decline
                  </button>
                </div>
              </div>
            );
          })}
      </>
    );
  };

  const Tutorial = () => {
    if (props.projectlist.length === 0) {
      return (
        <>
          <div className={styles.tutorial__container}>
            <h3>Hello {props.user.username}! and welcome to</h3>
            <h3>[project Project]</h3>

            <div className={styles.tutorial__positioning}>
              <Image
                className={(styles.createButton, styles.createProjectBtn)}
                src={createButton}
                placeholder="blur"
                alt=""
              />
              <p className={styles.tutorial__text}>
                Hit the create button <br></br>to start a new project!
              </p>
            </div>
            <div className={styles.tutorial__positioning}>
              <Image
                className={(styles.createButton, styles.createProjectBtn)}
                src={createButton}
                placeholder="blur"
                alt=""
              />
              <p className={styles.tutorial__text}>
                Once you have a project! <br></br> create new events!
              </p>
            </div>
            <div className={styles.tutorial__positioning}>
              <Image
                className={(styles.createButton, styles.createProjectBtn)}
                src={createButton}
                placeholder="blur"
                alt=""
              />
              <p className={styles.tutorial__text}>
                Invite others and collaborate!
              </p>
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <div className="Sidebar">
      {inviteduser && <>{userInvited()}</>}
      <div>
        <h3 className={styles.Sidebar__title}></h3>
      </div>
      <div>
        <h3 className={styles.Sidebar__title}></h3>
        {<>{Tutorial()}</>}
      </div>
    </div>
  );
};

export default Sidebar;
