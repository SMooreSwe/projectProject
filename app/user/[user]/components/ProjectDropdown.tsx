"use client";
import React from "react";
import styles from "./userpage.module.css";
import { Project } from "../../../Types";

const ProjectDropdown = (props: { projectList: Project[] }) => {
  const handleDropdown = () => {};

  const populate = () => {
    if (props.projectList.length === 0) {
      return <option value="">Please select a project</option>;
    } else {
      return props.projectList.map((project) => (
        <option key={project.name} value={project.projectid}>
          {project.name}
        </option>
      ));
    }
  };

  return (
    <div>
      <label>
        Select Project:
        <select
          name="projectList"
          onChange={handleDropdown}
          className="selectProject"
        >
          {populate()}
        </select>
      </label>
    </div>
  );
};

export default ProjectDropdown;
