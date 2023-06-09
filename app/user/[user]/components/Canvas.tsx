"use client";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "../userpage.module.css";
import CreateWidget from "../modals/CreateWidget";
import {
  collection,
  FieldPath,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../../../firebase-config";
import { Project, WidgetType } from "../../../Types";
import Widget from "./Widget";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

const Canvas = (props: {
  children: ReactNode;
  project: string;
  projectList: Project[];
}) => {
  const [widgetList, setWidgetList] = useState<WidgetType[]>([]);
  const [priority, setPriority] = useState("medium");

  const [widgetimages, setWidgetImages] = useState<string[]>([]);
  const [widgetindex, setWidgetIndex] = useState<string[]>([]);

  const db = getFirestore(app) as any;

  useEffect(() => {
    getWidgets(props.project);
  }, [props.project]);

  const getWidgets = async (projectid: string) => {
    const docRef = query(
      collection(db, "widgets"),
      where("projectid", "==", projectid),
      orderBy("date")
    );
    onSnapshot(docRef, (querySnapshot) => {
      let data = [] as any[];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });

      const storage = getStorage();
      const urls: any[] = [];
      const widgetIndex: string[] = [];

      data.map((widget: WidgetType) => {
        const filePath = `/widgets/${widget.widgetid}.jpeg`;
        const storageRef = ref(storage, filePath);
        getDownloadURL(storageRef)
          .then((url) => {
            urls.push(url);
            widgetIndex.push(widget.widgetid);
            setWidgetImages([...urls]);
            setWidgetIndex([...widgetIndex]);
          })
          .catch((error) => {
            console.log(error);
          });
      });
      setWidgetList(data);
    });
  };

  return (
    <>
      <div className="canvas__container">
        <div>
          <CreateWidget
            projectid={props.project}
            projectList={props.projectList}
          />
        </div>
        <div className="canvas">
          {widgetList &&
            widgetimages &&
            widgetindex &&
            widgetList.map((widget) => {
              return (
                <Widget
                  key={widget.widgetid}
                  projectid={props.project}
                  widgetid={widget.widgetid}
                  date={widget.date}
                  priority={widget.priority}
                  prioritySetter={setPriority}
                  layout={widget.layout}
                  widgetimages={widgetimages}
                  widgetindex={widgetindex}
                  newPostits={widget.postits}
                  newTextbox={widget.textboxes}
                  newBoardImages={widget.boardImages}
                  newLinks={widget.links}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Canvas;
