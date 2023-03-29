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
import { Project, WidgetType } from "../../../Types";
import Widget from "./Widget";

const Canvas = (props: {
  children: ReactNode;
  project: string;
  projectList: Project[];
}) => {
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
          <CreateWidget
            projectid={props.project}
            projectList={props.projectList}
          />
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
                  layout={widget.layout}
                />
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Canvas;
