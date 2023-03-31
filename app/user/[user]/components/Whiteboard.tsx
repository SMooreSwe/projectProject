export {};
// import { doc, getFirestore, updateDoc } from "firebase/firestore";
// import React, { useEffect, useState } from "react";
// import { Layout, Responsive, WidthProvider } from "react-grid-layout";
// import "/node_modules/react-grid-layout/css/styles.css";
// import "/node_modules/react-resizable/css/styles.css";
// import { PostIt } from "../WhiteboardComponents/PostIt";
// import { Textblock } from "../WhiteboardComponents/Text";
// import { Postit } from "../../../Types";
// //import { WBImage } from "../WhiteboardComponents/WBImage";

// const ResponsiveGridLayout = WidthProvider(Responsive);

// const Whiteboard = (props: {
//   widgetid: string;
//   layouts: Layout[];
//   layoutSetter: Function;
//   postits: Postit[];
//   setPostit: Function;
//   show: boolean;
// }) => {
//   const { postits, layouts } = props;

//   const populate = () => {
//     postits.map((postit: Postit) => {
//       const layout = layouts.find((x) => x.i === postit.id);
//       console.log(layout);
//       if (layout) {
//         return <PostIt key={postit.id} data-grid={layout} />;
//       }
//     });
//   };

//   useEffect(() => {
//     props.layoutSetter(props.layouts);
//     //populate();
//   }, [props.show, props.layouts, props.postits]);

//   return (
//     <ResponsiveGridLayout
//       layouts={{
//         lg: props.layouts,
//         md: props.layouts,
//         sm: props.layouts,
//         xs: props.layouts,
//         xxs: props.layouts,
//       }}
//       className="layout"
//       compactType={null}
//       preventCollision={false}
//       isResizable={true}
//       resizeHandles={["se"]}
//       onDragStop={(layout: Layout[]) => {
//         props.layoutSetter(layout);
//       }}
//       breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
//       cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
//     >
//       {/*postits && <>populate()</>*/}
//       {postits &&
//         postits.map((postit: Postit) => {
//           const layout = layouts.find((x) => x.i === postit.id);
//           console.log(layout);
//           if (layout) {
//             return <PostIt key={postit.id} data-grid={layout} />;
//           }
//         })}
//     </ResponsiveGridLayout>
//   );
// };

// export default Whiteboard;
