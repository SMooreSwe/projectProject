"use client";
import React, { useEffect, useState } from "react";
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
import html2canvas from "html2canvas";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { Postit } from "../../../Types";
import { v4 } from "uuid";

import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { PostIt } from "../WhiteboardComponents/PostIt";
import { Textblock } from "../WhiteboardComponents/Text";
import { textShadow } from "html2canvas/dist/types/css/property-descriptors/text-shadow";
const ResponsiveGridLayout = WidthProvider(Responsive);

const Widget = (props: {
  projectid: string;
  widgetid: string;
  date: Timestamp;
  priority: string;
  layout: string;
  newpostits: string;
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
      setPostit(JSON.parse(props.newpostits));
    }
    console.log("--------------------");
    console.log(props.widgetimages);
    console.log(props.widgetindex);
    console.log("--------------------");
  }, [show, props.widgetid, props.layout, props.widgetimages]);

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
    console.log("TEXT BUTTON!!!");
  };

  const createPostit = () => {
    const uuid = v4();
    const newPostit = { id: uuid, postittext: "" };
    const newPostitArray = [...postit, newPostit];
    const newLayoutArray = [
      ...layout,
      { w: 1, h: 1, x: 1, y: 1, i: uuid, moved: false, static: false },
    ];
    setPostit(newPostitArray);
    setLayout(newLayoutArray);
  };

  const createImage = () => {
    console.log("IMAGE BUTTON!!!");
  };

  const createLink = () => {
    console.log("LINK BUTTON!!!");
  };

  const widgetImage = () => {
    console.log("function widgetimages");
    const array = props.widgetindex;
    const index = array.indexOf(props.widgetid);
    if (props.widgetindex.length && index !== -1) {
      console.log("MAP ---> HAS AN IMAGE");
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
      console.log("MAP ---> HAS NOOOOOOOOOO IMAGE");
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

  const populateWhiteboard = () => {
    return (
      <ResponsiveGridLayout
        layouts={{
          lg: layout,
          md: layout,
          sm: layout,
          xs: layout,
          xxs: layout,
        }}
        className="layout"
        compactType={null}
        preventCollision={false}
        isResizable={true}
        resizeHandles={["se"]}
        onLayoutChange={(layout: Layout[]) => {
          setLayout(layout);
        }}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      >
        {postit &&
          postit.map((singlePostit: Postit) => {
            const singleLayout = layout.find((x) => x.i === singlePostit.id);
            const text = singlePostit.postittext;
            if (singleLayout) {
              return (
                <PostIt
                  key={singlePostit.id}
                  data-grid={singleLayout}
                  // @ts-ignore: Unreachable code error
                  logger={logger}
                  coordinates={singleLayout.i}
                  text={text}
                  deleter={deleter}
                />
              );
            }
          })}
      </ResponsiveGridLayout>
    );
  };

  function logger(array: string[]) {
    setPostit((prevState) => {
      let nextState = [...prevState];
      const postitIndex = nextState.findIndex(
        (element) => element.id === array[1]
      );
      nextState[postitIndex].postittext = array[0];
      return nextState;
    });
  }

  function deleter(id: string) {
    setPostit((prevState) => {
      let nextState = [...prevState];
      const postitIndex = nextState.findIndex((element) => element.id === id);
      nextState.splice(postitIndex, 1);
      return nextState;
    });
  }

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
          {props.widgetimages && <>{widgetImage()}</>}
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
              {postit && show === true && <>{populateWhiteboard()}</>}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Widget;
