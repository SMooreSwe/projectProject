import React from 'react'

//eslint-disable-next-line react/display-name
export const PostIt = React.forwardRef<HTMLDivElement>(({style, className, onMouseDown, onMouseUp, onTouchEnd, children, ...props}: any, ref) => {
  const typingFunction = (e: any) => {
      //return typing here
  }

  return (
  <p style={style} className={className} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onTouchEnd}>
   {(e: any) => typingFunction(e)}
   {children}
  </p>
);
})
