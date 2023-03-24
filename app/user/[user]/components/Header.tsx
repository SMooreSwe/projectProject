import React, { ReactNode } from 'react'

const Header = (props: {children : ReactNode}) => {
  return (
    <>
    <div>Header</div>
        {props.children}
    <div>Header end</div>
    </>
  )
}

export default Header