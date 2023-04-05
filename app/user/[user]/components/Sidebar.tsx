import React, { useEffect, useRef, useState } from "react";
import styles from "../userpage.module.css";
import profileImage from "../../../../public/profileImage.png";
import Image from "next/image";
import { BsCheckSquareFill } from "react-icons/bs";
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
import { messaging } from "firebase-admin";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const Sidebar = (props: {
  user: { email: string; username: string; userid: string };
  projectlist: Project[];
  projectid: string;
}) => {
  const [invitedUser, setInvitedUSer] = useState<Invited[]>([]);
  const [userUpdates, setUserUpdates] = useState<UserUpdate[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessages[]>([]);

  const [allNotificationImages, setAllNotificationImages] = useState<string[]>(
    []
  );
  const [userNotificationIndex, setUserNotificationIndex] = useState<string[]>(
    []
  );

  const db = getFirestore(app) as any;

  const getNotifications = async () => {
    if (props.user.userid) {
      const docRef = query(
        collection(db, "notifications", props.user.userid, "usernotifications")
      );
      onSnapshot(docRef, (querySnapshot) => {
        let alluserid = [] as any[]
    
        let invites = [] as any[];
        let updates = [] as any[];
        querySnapshot.forEach((doc) => {
          if (doc.data().invitationuid) {
            invites.push(doc.data());
            alluserid.push(doc.data().userinvitingid)
          } else {
            updates.push(doc.data());
            alluserid.push(doc.data().usersendingupdateid)
          }
        });
        setUserUpdates([...updates]);
        setInvitedUSer([...invites]);
        const storage = getStorage();

        const urls: any[] = [];
        const userIndex: string[] = [];

        alluserid.map((userid: string) => {
          const filePath = `/users/${userid}.jpeg`;
          const storageRef = ref(storage, filePath);
          getDownloadURL(storageRef)
            .then((url) => {
              urls.push(url);
              userIndex.push(userid);
              setAllNotificationImages([...urls]);
              setUserNotificationIndex([...userIndex]);
            })
            .catch((error) => {
              console.log(error);
            });
        });
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
        usersendingupdateid: props.user.userid,
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
        usersendingupdateid: props.user.userid,
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
                  {<>{filter(invitation.userinvitingid)}</>}
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
                  {<>{filter(userupdate.usersendingupdateid)}</>}
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

  const filter = (userid: string) => {
    const index = userNotificationIndex.indexOf(userid);
    if (index !== -1) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="UserProfileImage"
          src={allNotificationImages[index]}
          placeholder="blur"
          alt=""
        />
      );
    } else {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="UserProfileImage"
          src={"/profileImage.png"}
          placeholder="blur"
          alt=""
        />
      );
    }
  };

  const populateMessages = () => {
    return (
      <>
        {chatMessages &&
          chatMessages.map((chat: ChatMessages) => {
            const timestamp = chat.timestamp;
            const currenttimestamp = timestamp
              ? timestamp.toMillis()
              : Date.now();
            if (currenttimestamp !== null) {
              if (chat.chatuserid === props.user.userid) {
                return (
                  <div
                    className="Sidebar__messagebubble-container-self"
                    key={chat.messageid}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element*/}
                    <p className="Sidebar__messagebubble-name">{chat.name}</p>
                    <div className="Sidebar__messagebubble-self">
                      <p className="Sidebar__messagebubble-text">{chat.text}</p>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="Sidebar__messagebubble-container-parent" key={chat.messageid}>
                    <div
                    className="Sidebar__messagebubble-container-child"
                  >
                    <div
                      key={chat.messageid}
                      className="Sidebar__messagebubble-other"
                    >
                      <p className="Sidebar__messagebubble-text-other">{chat.text}</p>
                    </div>
                    {/* eslint-disable-next-line @next/next/no-img-element*/}
                    <p className="Sidebar__messagebubble-name-other">{chat.name}</p>
                  </div>
                  </div>
                  
                );
              }
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
        <h3 className={"Sidebar__title"}>{title}</h3>
      </>
    );
  };

  const tutorial = () => {
    if (props.projectlist.length === 0) {
      return (
        <>
          <div className={styles.tutorial__container}>
            <h3 className={styles.tutorial__title}>Hello {props.user.username}! Welcome to [project Project]</h3>

            <div className={styles.tutorial__positioning}>
              <p className="tutorial__subtitle">
                Projects
              </p>
              <p className={styles.tutorial__text}>
                Click the Create New Project button above to start a new
                project!
              </p>
            </div>
            <div className={styles.tutorial__positioning}>
              <p className="tutorial__subtitle">
                Events
              </p>
              <p className={styles.tutorial__text}>
                Create new events by selecting the + button to the left!
              </p>
            </div>
            <div className={styles.tutorial__positioning}>
              <p className="tutorial__subtitle">
                Collaborators
              </p>
              <p className={styles.tutorial__text}>
                Click on collaborators to invite others to your project and
                collaborate!
              </p>
            </div>
            <div className={styles.tutorial__positioning}>
              <p className="tutorial__subtitle">
                Whiteboards
              </p>
              <p className={styles.tutorial__text}>
                Double click on an event to access its whiteboard functionality!
              </p>
            </div>
          </div>
        </>
      );
    }
  };

  const allMessages = () => {
    return (
      <>
        <div>
          <h3 className={"Sidebar__title"}>Chat</h3>
          <div className={styles.Sidebar__container}>
            <div className={"Sidebar__messagebox"}>
              {chatMessages.length > 0 && <>{populateMessages()}</>}
            </div>
            <div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  saveMessage();
                }}
                className={styles.Sidebar__typingbox}
                ref={messageForm}
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
                  value="Send"
                />
              </form>
            </div>
          </div>
        </div>
      </>
    );
  };

  useEffect(() => {
    if (props.projectid) {
      loadMessages();
    }
  }, [props.projectid]);

  const messageInput = useRef<HTMLInputElement>(null);
  const messageForm = useRef<HTMLFormElement>(null);
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
        if (messageForm.current) {
          messageForm.current!.reset();
        }
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
    onSnapshot(recentMessagesQuery, (querySnapshot) => {
      let messages: any[] = [];
      querySnapshot.forEach((doc) => {
        const message = doc.data();
        messages.push(message);
      });
      setChatMessages([...messages]);
    });
  }

  return (
    <div className="Sidebar">
      {<>{notificationsTitle()}</>}
      {invitedUser && <>{userInvitedMessage()}</>}
      {userUpdates && <>{userUpdateMessage()}</>}
      {props.projectlist.length === 0 && <>{tutorial()}</>}
      {invitedUser.length === 0 &&
        userUpdates.length === 0 &&
        props.projectlist.length !== 0 && <>{allMessages()}</>}
    </div>
  );
};

export default Sidebar;
