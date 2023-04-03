import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import profileImage from "../../../../public/profileImage.png";
import createButton from "../../../../public/profileImage.png";
import Image from "next/image";
import styles from "../userpage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AddWidget } from "../utils/getMethods";
import { User } from "../../../Types";
import {
  getFirestore,
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
  arrayRemove,
  arrayUnion,
  doc,
  updateDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { app } from "../../../../firebase-config";
import { v4 } from "uuid";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

function CollaboratorsWidget(props: {
  projectid: string;
  username: string;
  userid: string;
  projectname: string;
  projectcollaborators: string[];
}) {
  const [users, setUsers] = useState<User[]>([
    {
      email: "",
      username: "",
      userid: "",
      projects: [],
    },
  ]);
  const [allimages, setAllimages] = useState<string[]>([]);
  const [userindex, setUserIndex] = useState<string[]>([]);

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const db = getFirestore(app) as any;

  const getUsers = async () => {
    const docRef = query(collection(db, "users"));
    onSnapshot(docRef, (querySnapshot) => {
      let data = [] as any[];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setUsers(data);
    });
  };

  useEffect(() => {
    getUsers();
    getAllimages();
  }, [props.projectid]);

  const getAllimages = async () => {
    const storage = getStorage();

    const urls: any[] = [];
    const userIndex: string[] = [];

    users.map((user: User) => {
      const filePath = `/users/${user.userid}.jpeg`;
      const storageRef = ref(storage, filePath);
      getDownloadURL(storageRef)
        .then((url) => {
          urls.push(url);
          userIndex.push(user.userid);
          setAllimages([...urls]);
          setUserIndex([...userIndex]);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  };

  const addCollaborator = async (e: any) => {
    const uuid = v4();
    const userid = e.target.value;
    await setDoc(
      doc(db, "notifications", `${userid}`, "usernotifications", uuid),
      {
        projectname: props.projectname,
        projectid: props.projectid,
        userinvitingname: props.username,
        userinvitingid: props.userid,
        invitationuid: uuid,
        created: serverTimestamp(),
      }
    );
    handleClose();
  };

  const removeCollaborator = async (e: any) => {
    const userid = e.target.value;
    const projectRef = doc(db, "projects", props.projectid);
    await updateDoc(projectRef, {
      users: arrayRemove(userid),
    });
    const userRef = doc(db, "users", userid);
    await updateDoc(userRef, {
      projects: arrayRemove(props.projectid),
    });
    const uuid = v4();
    await setDoc(doc(db, "notifications", userid, "usernotifications", uuid), {
      projectname: props.projectname,
      projectid: props.projectid,
      usersendingupdate: props.username,
      usermessage: "has removed you from project",
      updateuid: uuid,
      created: serverTimestamp(),
    });
    handleClose();
  };

  const filter = (userid: string) => {
    const index = userindex.indexOf(userid);
    if (index !== -1) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="UserProfileImage"
          src={allimages[index]}
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

  const usersInProject = () => {
    return (
      <>
        <p className="card__title">Project collaborators:</p>
        {users &&
          users.map((user: User) => {
            const userProjects = user.projects;
            if (userProjects.includes(props.projectid)) {
              return (
                <article key={user.userid} className="collaborator__container">
                  <div className="collaborator__infocontainer">
                    {allimages && <>{filter(user.userid)}</>}
                    <p className="collaborator__name">{user.username}</p>
                  </div>
                  <button
                    value={user.userid}
                    onClick={removeCollaborator}
                    className="collaborator__btn-remove"
                  >
                    REMOVE
                  </button>
                </article>
              );
            }
          })}
      </>
    );
  };

  const usersNotInProject = () => {
    return (
      <>
        <p className="card__title">Add collaborators:</p>
        {users &&
          users.map((user: User, index) => {
            const userProjects = user.projects;
            if (!userProjects.includes(props.projectid)) {
              return (
                <article key={user.userid} className="collaborator__container">
                  <div className="collaborator__infocontainer">
                    {allimages && <>{filter(user.userid)}</>}
                    <p className="collaborator__name">{user.username}</p>
                  </div>
                  <button
                    value={user.userid}
                    onClick={addCollaborator}
                    className="collaborator__btn-add"
                  >
                    ADD
                  </button>
                </article>
              );
            }
          })}
      </>
    );
  };

  const members = () => {
    return (
      <p className={styles.collaborators__number}>
        +{props.projectcollaborators.length}
      </p>
    );
  };

  return (
    <>
      <button onClick={handleShow} className="collaborator__containerbtn">
        <div className={styles.collaboratorBtn}>
          {/*eslint-disable-next-line @next/next/no-img-element*/}
          <img
            className={styles.collaborators__image}
            src={"/collab1.png"}
            placeholder="blur"
            alt=""
          />
        </div>
        {props.projectcollaborators.length > 1 && <>{members()}</>}
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add a collaborator</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {users && <>{usersInProject()}</>}
          {users && <>{usersNotInProject()}</>}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default CollaboratorsWidget;
