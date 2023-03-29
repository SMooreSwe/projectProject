"use client";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "../userpage.module.css";
import CreateWidget from "../modals/CreateWidget";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../../../firebase-config";
import { WidgetType } from "../../../Types";
import Widget from "./Widget";

const Canvas = (props: { children: ReactNode; project: string }) => {
  const [widgetList, setWidgetList] = useState<WidgetType[]>([]);
  const [priority, setPriority] = useState("medium");
  const db = getFirestore(app) as any;

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
      setWidgetList(data);
    });
  };

  useEffect(() => {
    getWidgets(props.project);
  }, [props.project]);

  return (
    <>
      <div className="canvas__container">
        <div>
          <CreateWidget projectid={props.project} />
        </div>
        <div className="canvas">
          {widgetList &&
            widgetList.map((widget) => {
              return (
                <Widget
                  key={widget.widgetid}
                  projectid={props.project}
                  widgetid={widget.widgetid}
                  date={widget.date}
                  priority={widget.priority}
                  prioritySetter={setPriority}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Canvas;
