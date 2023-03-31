import React from 'react'
import Image from 'next/image'
import './about.css';

const About = () => {
  return (
    <main className='main__about-page'>
      <h1>About [project Project]</h1>

      <section className='section section___project-who'>
      <h2 className='section__title'>Who We Are</h2>
      <p>We are four people with completely different nationalities, career backgrounds, and skillsets who are all motivated by the same thing: creating practical and accessible software.</p>
      </section>
      
      <section className='section section__project-what'>
      <h2 className='section__title'>What It Is</h2>
      <p>[project Project] is a collaborative and interactive project management application. It was ideated in two hours, planned in a day, then developed within the span of 11 days by four full-stack Javascript students a part of the winter 2023 class from the <a href="https://www.salt.study/our-hubs/stockholm/code-bootcamps/javascript-fullstack" target="_blank">School of Applied Learning and Technology</a>, aka salt.</p>
      </section>

      <section className='section section__project-why'>
      <h2 className='section__title'>Why We Did It</h2>
      <p>We wanted to showcase the technical knowledge and skills we have gained during our intensive 12-week bootcamp at salt, including:</p>
      <ul className="ul__project-why">
          <li>Creating SPAs</li>
          <li>State management and persistence</li>
          <li>Implementing CRUD operations</li>
          <li>Data modelling and querying</li>
      </ul>
      <p>We also wanted to create a tool that unifies the project management functionality of an application like Jira with the whiteboarding functionality of an application like Miro.</p>
      </section>

      <section className='section section__project-how'>
      <h2 className='section__title'>How We Did It</h2>
      <p>From the beginning, we found balance between thorough planning and remaining agile. We planned our must-haves, like which components, collections, documents, queries, and CRUD operations our application absolutely needed. How we implemented these things and how it would ultimatley look remained agile. If an approach or library did not work for us within a few hours, we scrapped it and searched for something more effective and time efficient.</p>
      <div className="about-page__images-container">
      <Image
        src="/first-sketch.jpg"
        alt="[project Project]'s very first UI sketch"
        width={600}
        height={375}
      />
      <Image 
      className='section__project-img'
      src="/component-mapping.jpg"
      alt="first draft of our components and application architecture"
      width={600}
      height={375}
      />
      </div>
      <p>View the [project Project] Github repo <a href="https://github.com/SMooreSwe/projectProject" target="_blank">here</a>.</p>
      </section>
    </main>
  )
}

export default About 
