'use client'; 

import React from 'react'

const Form = () => {
  return (
    <>
    <div onSubmit={(e) => e.preventDefault}>Form</div>
    <form action="">
        <input type="text" placeholder='username'/>
        <button>Submit</button>
    </form>
    </>
  )
}

export default Form