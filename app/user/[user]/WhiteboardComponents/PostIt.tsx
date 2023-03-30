import React from 'react'

//eslint-disable-next-line react/display-name
export const PostIt = React.forwardRef<HTMLDivElement>(({style, className, onMouseDown, onMouseUp, onTouchEnd, children, ...props}: any, ref) => {
  const typingFunction = (e: any) => {
      //return typing here
  }

  return (
  <div style={style} className={["postit", className].join(' ')} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onTouchEnd}>
   <textarea name="" id="" onChange={(e) => console.log(e.target.value)} className='postit__text' placeholder='press enter to save'></textarea>
   {children}
  </div>
);
})
