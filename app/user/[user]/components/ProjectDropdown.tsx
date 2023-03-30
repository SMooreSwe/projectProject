"use client";
import React, { SetStateAction, useEffect, useRef, useState } from "react";
import styles from "../userpage.module.css";
import { Project } from "../../../Types";

const ProjectDropdown = (props: {
  projectList: Project[];
  projectSetter: Function;
}) => {

  
  const handleDropdown = (e: React.ChangeEvent<HTMLSelectElement>) => {
    props.projectSetter(e.target.value);
  };

  const dropdown = useRef<HTMLSelectElement>(null)
  const populate = () => {

    if (props.projectList.length === 0) {
      return <option value="">Select a project...</option>;
    } else {
      return props.projectList.map((project) => (
        <option key={project.projectid} value={project.projectid}>
          {project.name}
        </option>
      ));
    }
  };

  useEffect(() => {
    dropdown.current!.selectedIndex =0
  }, [props.projectList])

  return (
    <div>
      <select
      ref={dropdown}
        className={styles.headerSearchField}
        name="projectList"
        onChange={handleDropdown}
      >
        {populate()}
      </select>
    </div>
  );
};

export default ProjectDropdown;
