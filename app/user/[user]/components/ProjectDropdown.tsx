"use client";
import React from "react";
import styles from "../userpage.module.css";
import { Project } from "../../../Types";

const ProjectDropdown = (props: { projectList: Project[] }) => {
  const handleDropdown = () => {};

  const populate = () => {
    if (props.projectList.length === 0) {
      return <option value="">Please create a project...</option>;
    } else {
      return props.projectList.map((project) => (
        <option key={project.projectid} value={project.projectid}>
          {project.name}
        </option>
      ));
    }
  };

  return (
    <div>
      <select
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
