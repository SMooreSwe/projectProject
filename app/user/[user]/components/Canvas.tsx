import React, { ReactNode } from 'react'

const Canvas = (props: {children : ReactNode}) => {
  return (
    <>
    <div>Canvas</div>
    {props.children}
    <div>Canvas end</div>
    </>
  )
}

export default Canvas