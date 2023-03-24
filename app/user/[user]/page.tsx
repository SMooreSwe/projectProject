import React from 'react'
import Widget from './components/Widget'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ProjectDropdown from './components/ProjectDropdown'
import MonthContainer from './components/MonthContainer'
import Canvas from './components/Canvas'
import styles from './userpage.module.css'

const user = () => {
  return (
    <div className={styles.page}>
    <Header>
      <ProjectDropdown/>
    </Header>
    <Sidebar/>
    <Canvas>
      <MonthContainer>
        <Widget/>
      </MonthContainer>
    </Canvas>
    </div>
  )
}

export default user 