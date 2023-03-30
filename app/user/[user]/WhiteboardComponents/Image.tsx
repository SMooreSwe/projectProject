import React from 'react'

//eslint-disable-next-line react/display-name
export const Image = React.forwardRef<HTMLDivElement>(({style, className, onMouseDown, onMouseUp, onTouchEnd, children, ...props}: any, ref) => {
  const imgUrl = () => {
    //return firestore image url for input 
  }
  
    return (
    <img alt='' src={imgUrl()} style={style} className={className} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onTouchEnd}>
     {children}
    </img>
  );
})