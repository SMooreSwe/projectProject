import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import profileImage from "../../../../public/profileImage.png";
import createButton from "../../../../public/profileImage.png";
import Image from "next/image";
import styles from "../userpage.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { AddWidget } from "../utils/getMethods";
import { User } from "../../../Types";

function CollaboratorsWidget(props: { projectid: string }) {
  const [users, setUsers] = useState<User[]>([]);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [inputs, setInputs] = useState({
    invitedid: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputs.invitedid.length > 0) {
      setInputs((values) => ({ ...values, date: "" }));
      // await AddWidget(inputs.invitedid, props.projectid);
      handleClose();
    }
    console.log(inputs.invitedid);
  };

  const usersInProject = () => {
    // const usersInProject = users.filter(user => {
    //   return user.userid === props.projectid)
    // }
    if (users) {
      return users.map((user: User) => {
        <article key={user.userid} className="collaborator__container">
          <Image
            className={styles.UserProfileImage}
            src={profileImage}
            placeholder="blur"
            alt=""
          />
          <p className="widget__date">{user.username}</p>
          <button>ADD</button>
        </article>
      })
    }
  }

  const usersNotInProject = () => {
    // const usersInProject = users.filter(user => {
    //   return user.userid === props.projectid)
    // }
    if (users) {
      return users.map((user: User) => {
        <article key={user.userid} className="collaborator__container">
          <Image
            className={styles.UserProfileImage}
            src={profileImage}
            placeholder="blur"
            alt=""
          />
          <p className="widget__date">{user.username}</p>
          <button>ADD</button>
        </article>
      })
    }
  }
             

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

        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <button form="editmodal" className="formButton" type="submit">
            Add
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CollaboratorsWidget;
