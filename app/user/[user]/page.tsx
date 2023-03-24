import React from 'react'
import Widget from './components/Widget'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ProjectDropdown from './components/ProjectDropdown'
import MonthContainer from './components/MonthContainer'
import Canvas from './components/Canvas'

const user = () => {
  return (
    <>
    <Header>
      <ProjectDropdown/>
    </Header>
    <Sidebar/>
    <Canvas>
      <MonthContainer>
        <Widget/>
      </MonthContainer>
    </Canvas>
    </>
  )
}

export default user 