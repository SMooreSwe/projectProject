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
  projectname: string;
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

  const userImage = (userid: string) => {
    const storage = getStorage();
    const filePath = `/users/${userid}.jpeg`;
    const storageRef = ref(storage, filePath);

    return getDownloadURL(storageRef)
      .then((url) => {
        return url;
      })
      .catch((error) => {
        console.log(error);
        return;
      });
  };

  const getAllimages = async () => {
    console.log("Function called");
    const storage = getStorage();

    const allUrls: any[] = [];
    users.map((user: User) => {
      const userProjects = user.projects;
      if (userProjects.includes(props.projectid)) {
        const filePath = `/users/${user.userid}.jpeg`;
        const storageRef = ref(storage, filePath);
        getDownloadURL(storageRef).then((url) => {
          console.log("------URL-----------");
          console.log(url);
          allUrls.push(url);
        });
      }
    });
    console.log("----ALLURLS ------");
    console.log(allUrls);
    setAllimages(allUrls);
  };

  const addCollaborator = async (e: any) => {
    const uuid = v4();
    const userid = e.target.value;
    await setDoc(
      doc(db, "notifications", `${userid}`, "usernotifications", uuid),
      {
        projectname: props.projectname,
        projectid: props.projectid,
        userinviting: props.username,
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
    handleClose();
  };

  const usersInProject = () => {
    console.log(users);
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
                    <Image
                      className={styles.UserProfileImage}
                      src={profileImage}
                      placeholder="blur"
                      alt=""
                    />
                    <p className="collaborator__name">{user.username}</p>
                  </div>
                  <button
                    value={user.userid}
                    onClick={removeCollaborator}
                    className="collaborator__btn"
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
                    <Image
                      className={styles.UserProfileImage}
                      src={allimages[index]}
                      placeholder="blur"
                      alt=""
                    />
                    <p className="collaborator__name">{user.username}</p>
                  </div>
                  <button
                    value={user.userid}
                    onClick={addCollaborator}
                    className="collaborator__btn"
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

  return (
    <>
      <button onClick={handleShow} className={styles.collaboratorBtn}>
        <Image
          className={styles.createButton}
          src={createButton}
          placeholder="blur"
          alt=""
        />
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
