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
import html2canvas from "html2canvas";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { Postit } from "../../../Types";
import { v4 } from "uuid";

const Widget = (props: {
  projectid: string;
  widgetid: string;
  date: Timestamp;
  priority: string;
  layout: string;
  widgetimages: string[];
  widgetindex: string[];
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
  const [postit, setPostit] = useState<Postit[]>([]);

  useEffect(() => {
    if (props.layout) {
      setLayout(JSON.parse(props.layout));
    }
  }, [show, props.widgetid]);

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

  const widgetLayout = async (
    currentlayout: Layout[],
    currentpostits: Postit[]
  ) => {
    const input = document.querySelector<HTMLDivElement>(".whiteboard__photo");
    if (input) {
      html2canvas(input, {
        logging: true,
        useCORS: true,
      }).then((canvas) => {
        const imgData = canvas.toDataURL("img/png");
        uploadToStorage(imgData);
      });
    }
    const allLayouts = JSON.stringify(currentlayout);
    const allPostits = JSON.stringify(currentpostits);

    const widgetRef = doc(db, "widgets", widgetid);
    await updateDoc(widgetRef, {
      layout: allLayouts,
      postits: allPostits,
    });
    handleClose();
  };

  const uploadToStorage = async (imgData: any) => {
    const blob = await (await fetch(imgData)).blob();
    const storage = getStorage();
    const filePath = `/widgets/${widgetid}.jpeg`;
    const storageRef = ref(storage, filePath);
    uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("Uploaded a blob or file!");
    });
  };

  const createText = () => {
    console.log("TEXT!!!");
  };

  const createPostit = () => {
    const uuid = v4();
    console.log("POSTIT!!!");
    const newPostit = { id: uuid, postittext: "" };
    const newPostitArray = [...postit, newPostit];
    console.log(newPostitArray);
    const newLayoutArray = [
      ...layout,
      { w: 1, h: 1, x: 1, y: 1, i: uuid, moved: false, static: false },
    ];
    setPostit(newPostitArray);
    setLayout(newLayoutArray);
  };

  const createImage = () => {
    console.log("IMAGE!!!");
  };

  const createLink = () => {
    console.log("LINK!!!");
  };

  const widgetImage = (widgetid: string) => {
    const array = props.widgetindex;
    const index = array.indexOf(widgetid);
    if (props.widgetindex.length && index !== -1) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.widgetImage}
          src={props.widgetimages[index]}
          placeholder="blur"
          alt=""
        />
      );
    } else {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className={styles.widgetImage}
          src={"/editme.png"}
          placeholder="blur"
          alt=""
        />
      );
    }
  };

  return (
    <>
      <article className={`widget ${props.priority}`} onClick={handleShow}>
        <div className="widget-container">
          <p className="widget-container__date">{widgetDate}</p>
          <div>
            <select
              defaultValue={"medium"}
              className="widget__select"
              onChange={(e) => {
                widgetPriority(e.target.value);
              }}
            >
              <option value="medium">none</option>
              <option value="high">high</option>
            </select>

            <button
              onClick={() => deleteWidget()}
              className="widget-container__remove-btn"
            >
              X
            </button>
          </div>
        </div>
        <div className={`widget__main ${props.priority}`}>
          {props.widgetindex && <>{widgetImage(props.widgetid)}</>}
        </div>
      </article>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        fullscreen
        centered
      >
        <div className="whiteboard__header">
          <h3 className="whiteboard__title">{widgetDate}</h3>
          <div className="whiteboard__control-container">
            <div className="whiteboard__controlers">
              <div className="whiteboard__control">
                <button
                  onClick={createText}
                  className="whiteboard__control-btn"
                >
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/text.png"
                    alt=""
                  />
                </button>
                <p className="whiteboard__control-text">Text</p>
              </div>
              <div className="whiteboard__control">
                <button
                  onClick={createPostit}
                  className="whiteboard__control-btn"
                >
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/postit.png"
                    alt=""
                  />
                </button>
                <p className="whiteboard__control-text">Note</p>
              </div>
              <div className="whiteboard__control">
                <button
                  onClick={createImage}
                  className="whiteboard__control-btn"
                >
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/image.png"
                    alt=""
                  />
                </button>
                <p className="whiteboard__control-text">Image</p>
              </div>
              <div className="whiteboard__control">
                <button
                  onClick={createLink}
                  className="whiteboard__control-btn"
                >
                  {/*eslint-disable-next-line @next/next/no-img-element*/}
                  <img
                    className="whiteboard__control-image"
                    src="/link.png"
                    alt=""
                  />
                </button>
                <p className="whiteboard__control-text">Link</p>
              </div>
            </div>
          </div>
          <div className="widget__btn-container">
            <button
              onClick={() => widgetLayout(layout, postit)}
              className="widget-container__save-btn"
            >
              Save
            </button>
            <button
              className="widget-container__close-btn"
              onClick={() => handleClose()}
            >
              X
            </button>
          </div>
        </div>
        <Modal.Body className="whiteboard__body">
          <div className="whiteboard__photo">
            <div className={styles.whiteboard}>
              <Whiteboard
                widgetid={widgetid}
                layouts={layout}
                layoutSetter={setLayout}
                postits={postit}
                setPostit={setPostit}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Widget;
