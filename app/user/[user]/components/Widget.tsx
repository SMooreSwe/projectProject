"use client";
import React, { ReactNode } from "react";
import styles from "./userpage.module.css";
import "../../../globals.css";
import { WidgetType } from "../../../Types";
import { Timestamp } from "firebase/firestore";

const Widget = (props: { projectid: string, widgetid: string, date: Timestamp }) => {
  const { projectid, widgetid, date} = props
  const widgetDate = date.toDate().toLocaleDateString()

  return (
    <article className="widget">
      <p className="widget__date">{widgetDate}</p>
      <div className="widget__main">{widgetid}</div>
    </article>
  );
};

export default Widget;
