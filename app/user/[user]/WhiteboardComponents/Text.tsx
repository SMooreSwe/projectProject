import React from 'react'

//eslint-disable-next-line react/display-name
export const Textblock = React.forwardRef<HTMLDivElement>(({style, className, onMouseDown, onMouseUp, onTouchEnd, children, ...props}: any, ref) => {
    const typingFunction = (e: any) => {
        //return typing here
    }

    return (
    <p style={style} className={["textblock", className].join(' ')} ref={ref} onMouseDown={onMouseDown} onMouseUp={onMouseUp} onTouchEnd={onTouchEnd}>
     <textarea name="" id="" className='textblock__text' placeholder='press enter to save'></textarea>
     {children}
    </p>
  );
})