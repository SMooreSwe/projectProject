"use client";
import React, { useEffect, useState } from "react";
import Whiteboard from "./Whiteboard";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import styles from "../userpage.module.css";
import "../../../globals.css";
import {
  Timestamp,
  arrayRemove,
  deleteDoc,
  doc,
  getFirestore,
  updateDoc,
} from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import { app } from "@/firebase-config";
import { Layout } from "react-grid-layout";

const Widget = (props: {
  projectid: string;
  widgetid: string;
  date: Timestamp;
  priority: string;
  layout: string;
  prioritySetter: Function;
}) => {
  const { widgetid, date } = props;

  const monthNames = [
    "Jan",
    "Feb",
    "March",
    "April",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = monthNames[date.toDate().getMonth()];
  const day = date.toDate().getUTCDate();

  const widgetDate = day + " " + month;
  const [show, setShow] = useState(false);
  const [layout, setLayout] = useState<Layout[]>([]);

  useEffect(() => {
    setLayout(JSON.parse(props.layout));
    console.log("-----------PARSED----------");
    console.log(JSON.parse(props.layout));
    console.log("-----------PARSED----------");
  }, [show]);

  const db = getFirestore(app) as any;
  const deleteWidget = async () => {
    const widgetRef = doc(db, "widgets", widgetid);
    await deleteDoc(widgetRef);
  };

  const widgetPriority = async (priorityValue: string) => {
    const widgetRef = doc(db, "widgets", widgetid);
    await updateDoc(widgetRef, { priority: priorityValue });
    props.prioritySetter(priorityValue);
  };

  const handleClose = () => setShow(false);
  const handleShow = (e: any) => {
    if (e.detail == 2) {
      setShow(true);
    }
  };

  const widgetLayout = async (currentlayout: Layout[]) => {
    const test = JSON.stringify(currentlayout);
    const widgetRef = doc(db, "widgets", widgetid);
    await updateDoc(widgetRef, { layout: test });
  };

  return (
    <>
      <article className={`widget ${props.priority}`} onClick={handleShow}>
        <div className="widget-container">
          <p className="widget-container__date">{widgetDate}</p>
          <div>
            <select
              className="widget__select"
              onChange={(e) => {
                widgetPriority(e.target.value);
              }}
            >
              <option selected={true} value="medium">
                none
              </option>
              <option value="high">high priority</option>
            </select>

            <button
              onClick={() => deleteWidget()}
              className="widget-container__remove-btn"
            >
              X
            </button>
          </div>
        </div>
        <div className={`widget__main ${props.priority}`}></div>
      </article>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        size="xl"
        centered
      >
        <Modal.Header closeButton className="whiteboard__header">
          <Modal.Title className="whiteboard__title">{widgetDate}</Modal.Title>
          <button
            onClick={() => widgetLayout(layout)}
            className="widget-container__save-btn"
          >
            Save
          </button>
        </Modal.Header>
        <Modal.Body className="whiteboard__body">
          <div className={styles.whiteboard}>
            <Whiteboard
              widgetid={widgetid}
              layouts={layout}
              setLayout={setLayout}
            />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Widget;
