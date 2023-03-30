import React, { ReactNode } from 'react'

// export const PostIt = React.forwardRef(({
//   style, 
//   className, 
//   key,
//   children, 
//   ...props
//  }, ref)) => {
//   return (
//     <div style={{...style}} className={["postit", className].join()} {...props} ref={ref} key={key}>
//       {JSON.stringify(ref)}
//         {children}
//     </div>
//   )
// }

//eslint-disable-next-line react/display-name
export const PostIt = React.forwardRef<HTMLDivElement>(({style, className, onMouseDown, onMouseUp, onTouchEnd, children, key}: any, ref) => {
  return (
    <div key={key} style={style} className={className} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onTouchEnd}>
    Hello
      {children}
    </div>
  );
})


// export const PostIt = () => {
//   return (
//     <div>PostIt</div>
//   )
// }
