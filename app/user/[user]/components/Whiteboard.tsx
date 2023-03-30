import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";
import { PostIt } from "../WhiteboardComponents/PostIt";
import { Textblock } from "../WhiteboardComponents/Text";
//import { WBImage } from "../WhiteboardComponents/WBImage";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Whiteboard = (props: {
  widgetid: string;
  layouts: Layout[];
  setLayout: Function;
}) => {
  return (
    <ResponsiveGridLayout
      layouts={{
        lg: props.layouts,
        md: props.layouts,
        sm: props.layouts,
        xs: props.layouts,
        xxs: props.layouts,
      }}
      className="layout"
      compactType={null}
      preventCollision={false}
      isResizable={true}
      resizeHandles={["se"]}
      onLayoutChange={(layout: Layout[]) => {
        props.setLayout(layout);
      }}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    >
      <PostIt key={"test"} data-grid={props.layouts[0]} />
      <Textblock key={"text"} data-grid={props.layouts[1]} />
    </ResponsiveGridLayout>
  );
};

export default Whiteboard;
