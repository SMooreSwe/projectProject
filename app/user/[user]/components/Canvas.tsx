"use client";
import React, { ReactNode, useEffect, useState } from "react";
import styles from "../userpage.module.css";
import createButton from "../../../../public/createbutton.png";
import Image from "next/image";
import CreateWidget from "../modals/CreateWidget";

const Canvas = (props: { children: ReactNode; project: string }) => {
  useEffect(() => {
    console.log("TEST");
  }, [props.project]);

  const createWidget = () => {};

  return (
    <>
      <div className="canvas__container">
        <div>
          <CreateWidget projectid={props.project} />
        </div>
        <div className="canvas">{props.children}</div>
      </div>
    </>
  );
};

export default Canvas;
