import React, { ReactNode } from 'react'

const MonthContainer = (props: {children : ReactNode}) => {
  return (
    <>
    <div>MonthContainer</div>
    {props.children}
    <div>MonthContainer end</div>
    </>
  )
}

export default MonthContainer