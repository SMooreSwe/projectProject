import React, { ReactNode } from "react";
import styles from "./userpage.module.css";

const MonthContainer = (props: { children: ReactNode }) => {
  return (
    <>
      <div></div>
      {props.children}
      <div></div>
    </>
  );
};

export default MonthContainer;
