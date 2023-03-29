import { doc, getFirestore, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { Layout, Responsive, WidthProvider } from "react-grid-layout";
import "/node_modules/react-grid-layout/css/styles.css";
import "/node_modules/react-resizable/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

const Whiteboard = (props: {
  widgetid: string;
  layouts: Layout[];
  setLayout: Function;
}) => {
  return (
    <ResponsiveGridLayout
      layouts={{ lg: props.layouts }}
      className="layout"
      compactType={null}
      preventCollision={false}
      isResizable={true}
      resizeHandles={["se"]}
      onLayoutChange={(layout: Layout[]) => {
        props.setLayout(layout);
      }}
      // layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
    >
      <div className="box" key="1">
        1
      </div>
      <div className="box" key="2">
        2
      </div>
      <div className="box" key="3">
        3
      </div>
    </ResponsiveGridLayout>
  );
};

export default Whiteboard;
