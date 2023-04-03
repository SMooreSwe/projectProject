import React, { useEffect, useRef, useState } from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import Image from "next/image";
import { User } from "firebase/auth";
import { Invited, UserUpdate } from "../../../Types";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../../../firebase-config";
import { uuid } from "uuidv4";
import createButton from "../../../../public/createbutton.png";
import { Project, ChatMessages } from "../../../Types";
import { v4 } from "uuid";

const Sidebar = (props: {
  user: { email: string; username: string; userid: string };
  projectlist: Project[];
  projectid: string;
}) => {
  const [invitedUser, setInvitedUSer] = useState<Invited[]>([]);
  const [userUpdates, setUserUpdates] = useState<UserUpdate[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessages[]>([]);

  const db = getFirestore(app) as any;

  const getNotifications = async () => {
    if (props.user.userid) {
      const docRef = query(
        collection(db, "notifications", props.user.userid, "usernotifications")
      );
      onSnapshot(docRef, (querySnapshot) => {
        let invites = [] as any[];
        let updates = [] as any[];
        querySnapshot.forEach((doc) => {
          if (doc.data().invitationuid) {
            invites.push(doc.data());
          } else {
            updates.push(doc.data());
          }
        });
        setUserUpdates([...updates]);
        setInvitedUSer([...invites]);
      });
    }
  };

  useEffect(() => {
    getNotifications();
  }, [props.user, props.projectlist]);

  const AcceptProject = async (e: any) => {
    const array = e.target.value;
    const arraySplit = array.split(",");

    const projectid = arraySplit[0];
    const invitationuid = arraySplit[1];
    const userinvitingid = arraySplit[2];
    const projectname = arraySplit[3];
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
    const uuid = v4();
    await setDoc(
      doc(db, "notifications", `${userinvitingid}`, "usernotifications", uuid),
      {
        projectname: projectname,
        projectid: projectid,
        usersendingupdate: props.user.username,
        usermessage: "has accepted your invitation to project",
        updateuid: uuid,
        created: serverTimestamp(),
      }
    );
  };

  const DeclineProject = async (e: any) => {
    const array = e.target.value;
    const arraySplit = array.split(",");

    const projectid = arraySplit[0];
    const invitationuid = arraySplit[1];
    const userinvitingid = arraySplit[2];
    const projectname = arraySplit[3];

    await deleteDoc(
      doc(
        db,
        "notifications",
        props.user.userid,
        "usernotifications",
        invitationuid
      )
    );
    const uuid = v4();
    await setDoc(
      doc(db, "notifications", `${userinvitingid}`, "usernotifications", uuid),
      {
        projectname: projectname,
        projectid: projectid,
        usersendingupdate: props.user.username,
        usermessage: "has declined your invitation to project",
        updateuid: uuid,
        created: serverTimestamp(),
      }
    );
  };

  const removeAfterReadingUpdate = async (e: any) => {
    const updateuid = e.target.value;
    await deleteDoc(
      doc(
        db,
        "notifications",
        props.user.userid,
        "usernotifications",
        updateuid
      )
    );
  };

  const userInvitedMessage = () => {
    notificationsTitle();
    return (
      <>
        {invitedUser &&
          invitedUser.map((invitation: Invited) => {
            return (
              <div
                key={invitation.invitationuid}
                className={styles.notification__container}
              >
                <div className={styles.notification__message}>
                  <Image
                    className="UserProfileImage"
                    src={profileImage}
                    placeholder="blur"
                    alt=""
                  />
                  <p>
                    {invitation.userinvitingname} has invited you to join
                    project {invitation.projectname}
                  </p>
                </div>
                <div className={styles.notification__buttons}>
                  <button
                    value={[
                      invitation.projectid,
                      invitation.invitationuid,
                      invitation.userinvitingid,
                      invitation.projectname,
                    ]}
                    onClick={AcceptProject}
                    className={styles.notification__button}
                  >
                    Accept
                  </button>
                  <button
                    value={[
                      invitation.projectid,
                      invitation.invitationuid,
                      invitation.userinvitingid,
                      invitation.projectname,
                    ]}
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

  const userUpdateMessage = () => {
    notificationsTitle();
    return (
      <>
        {userUpdates &&
          userUpdates.map((userupdate: UserUpdate) => {
            return (
              <div
                key={userupdate.updateuid}
                className={styles.notification__container}
              >
                <div className={styles.notification__message}>
                  <Image
                    className="UserProfileImage"
                    src={profileImage}
                    placeholder="blur"
                    alt=""
                  />
                  <p>
                    {userupdate.usersendingupdate} {userupdate.usermessage}{" "}
                    {userupdate.projectname}
                  </p>
                </div>
                <div className={styles.notification__buttons}>
                  <button
                    value={userupdate.updateuid}
                    onClick={removeAfterReadingUpdate}
                    className={styles.notification__button}
                  >
                    Ok
                  </button>
                </div>
              </div>
            );
          })}
      </>
    );
  };

  const populateMessages = () => {
    //const timestamp = timestamp ? timestamp.toMillis() : Date.now();
    return (
      <>
        {chatMessages &&
          chatMessages.map((chat: ChatMessages) => {
            if (chat.chatuserid === props.user.userid) {
              return (
                <div
                  key={chat.messageid}
                  className="Sidebar__messagebubble-self"
                >
                  <p>What up with this USER...</p>
                </div>
              );
            } else {
              return (
                <div
                  key={chat.messageid}
                  className="Sidebar__messagebubble-other"
                >
                  <p>What up with this NOT USER...</p>
                </div>
              );
            }
          })}
      </>
    );
  };

  const notificationsTitle = () => {
    let title = "";
    if (invitedUser.length > 0 || userUpdates.length > 0) {
      title = "Activity";
    }
    return (
      <>
        <h3 className={styles.Sidebar__title}>{title}</h3>
      </>
    );
  };

  const Tutorial = () => {
    if (props.projectlist.length === 0) {
      return (
        <>
          <div className={styles.tutorial__container}>
            <h3>Hello {props.user.username}! Welcome to [project Project]</h3>

            <div className={styles.tutorial__positioning}>
              <Image
                className={(styles.createButton, styles.createProjectBtn)}
                src={createButton}
                placeholder="blur"
                alt=""
              />
              <p className={styles.tutorial__text}>
                Click the Create New Project button above to start a new
                project!
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
                Once you have a project, create new events by selecting the +
                button to the left!
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
                Click on collaborators to invite others to your project and
                collaborate!
              </p>
            </div>
          </div>
        </>
      );
    } else {
      return (
        <>
          <div>
            <h3 className={styles.Sidebar__title}>Comments</h3>
            <div className={styles.Sidebar__container}>
              <div className={styles.Sidebar__messagebox}>
                {chatMessages.length > 0 && <>{populateMessages()}</>}
              </div>
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveMessage();
                  }}
                  className={styles.Sidebar__typingbox}
                >
                  <input
                    ref={messageInput}
                    className={styles.Sidebar__typingField}
                    type="text"
                    name="name"
                    required
                  />
                  <input
                    className="Sidebar__sendbtn"
                    type="submit"
                    value="Submit"
                  />
                </form>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  useEffect(() => {
    if (props.projectid) {
      loadMessages();
    }
  }, [props.projectid]);

  const messageInput = useRef<HTMLInputElement>(null);
  async function saveMessage() {
    const messageValue = messageInput.current!.value;
    const uuid = v4();
    if (messageValue && messageValue.length > 0) {
      // Add a new message entry to the Firebase database.
      try {
        await setDoc(
          doc(
            getFirestore(),
            "messages",
            props.projectid,
            "usermessages",
            uuid
          ),
          {
            messageid: uuid,
            name: props.user.username,
            chatuserid: props.user.userid,
            text: messageValue,
            profilePicUrl: `${props.user.userid}.jpeg`,
            timestamp: serverTimestamp(),
          }
        );
      } catch (error) {
        console.error("Error writing new message to Firebase Database", error);
      }
    }
  }

  // Loads chat messages history and listens for upcoming ones.
  // Create the query to load the last 12 messages and listen for new ones.
  function loadMessages() {
    const recentMessagesQuery = query(
      collection(getFirestore(), "messages", props.projectid, "usermessages"),
      orderBy("timestamp", "desc"),
      limit(8)
    );
    // Start listening to the query.
    const messages: any[] = [];
    onSnapshot(recentMessagesQuery, function (snapshot) {
      snapshot.docChanges().forEach(function (change) {
        const message = change.doc.data();
        messages.push(message);
        setChatMessages([...messages]);
      });
    });
  }

  return (
    <div className="Sidebar">
      {<>{notificationsTitle()}</>}
      {invitedUser && <>{userInvitedMessage()}</>}
      {userUpdates && <>{userUpdateMessage()}</>}
      <div>
        <h3 className={styles.Sidebar__title}></h3>
        {<>{Tutorial()}</>}
      </div>
    </div>
  );
};

export default Sidebar;
