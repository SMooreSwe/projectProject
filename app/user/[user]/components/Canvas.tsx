import React, { ReactNode } from 'react'
import styles from './userpage.module.css'

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