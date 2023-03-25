import React, { ReactNode } from "react";
import styles from "./userpage.module.css";

const MonthContainer = (props: { children: ReactNode }) => {
  return (
    <>
      <div>MonthContainer</div>
      {props.children}
      <div>MonthContainer end</div>
    </>
  );
};

export default MonthContainer;
