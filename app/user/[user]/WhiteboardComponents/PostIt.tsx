import React, { ReactNode } from 'react'

export const PostIt = (props: {
  refStyle: Object, 
  refClassName: string, 
  key: string, 
  children: ReactNode
 }) => {
  const {refStyle, refClassName, key, children} = props
  
  return (
    <div style={refStyle} className={["postit", refClassName].join()} key={key}>
      <input type="text" />
        {children}
    </div>
  )
}