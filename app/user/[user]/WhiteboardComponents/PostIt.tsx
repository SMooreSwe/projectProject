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
export const PostIt = React.forwardRef<HTMLDivElement>(({style, className, onMouseDown, onMouseUp, onTouchEnd, children, ...props}: any, ref) => {
  return (
    <div key={props.key} style={style} className={className} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onTouchEnd}>
    hello
      {children}
    </div>
  );
})


// export const PostIt = () => {
//   return (
//     <div>PostIt</div>
//   )
// }
