"use client";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "../userpage.module.css";
import createButton from "../../../../public/createbutton.png";
import Image from "next/image";

const Canvas = (props: { children: ReactNode; project: string }) => {
  useEffect(() => {
    console.log("TEST");
  }, [props.project]);

  const createWidget = () => {};

  return (
    <>
      <div className="canvas__container">
        <div>
          <button onClick={createWidget} className="createwidget__button">
            <Image
              className={styles.createButton}
              src={createButton}
              placeholder="blur"
              alt=""
            />
          </button>
        </div>
        <div className="canvas">{props.children}</div>
      </div>
    </>
  );
};

export default Canvas;
