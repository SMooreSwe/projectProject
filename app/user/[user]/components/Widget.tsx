"use client";
import React, { useState  } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "../userpage.module.css";
import "../../../globals.css";
import { Timestamp, arrayRemove, deleteDoc, doc, getFirestore, updateDoc } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { app } from "@/firebase-config";

const Widget = (props: { projectid: string, widgetid: string, date: Timestamp }) => {
  const { projectid, widgetid, date} = props
  const widgetDate = date.toDate().toLocaleDateString()
  const [show, setShow] = useState(false);
 
  const deleteWidget = async () => {
    const db = getFirestore(app) as any;
    const widgetRef = doc(db, "widgets", widgetid);
    await deleteDoc(widgetRef)
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [inputs, setInputs] = useState({
    projectname: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   //Submit to save to widget object and call on close button
    }

  return (
    <>
    <article className="widget" onClick={handleShow}>
      <p className="widget__date">{widgetDate}</p>
      <div className="widget__main">
        {widgetid}
        <button onClick={() => deleteWidget()} className="remove_btn">Delete this whiteboard</button>
      </div>
    </article>

    <Modal
    show={show}
    onHide={handleClose}
    backdrop="static"
    keyboard={false}
    size='xl'
    >
    <Modal.Header closeButton>
      <Modal.Title>{widgetDate}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className={styles.whiteboard}>
        This is our whiteboard
      </div>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
    </Modal.Footer>
    </Modal>
    </>
  );
};

export default Widget;
