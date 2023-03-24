'use client'
import React, { ReactNode } from 'react'
import styles from '../userpage.module.css'

const Header = (props: {children : ReactNode}) => {
  return (
    <nav className={styles.Header}>
      {props.children}
      <div>
        <label htmlFor="">New Project</label>
        <button>+</button>
      </div>
      <div>
        <label htmlFor="">Collaborators</label>
        <button>imgHere</button>
      </div>
      <div>
        <button>Profile</button>
        <button>Settings</button>
      </div>
    </nav>
  )
}

export default Header