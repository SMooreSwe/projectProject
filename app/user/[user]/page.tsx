"use client";

import React, { useEffect, useState } from "react";
import Widget from "./components/Widget";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProjectDropdown from "./components/ProjectDropdown";
import MonthContainer from "./components/MonthContainer";
import Canvas from "./components/Canvas";
import styles from "./userpage.module.css";
import { getUser } from "./utils/getMethods";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User, Project } from "../../Types";
import {
  query,
  collection,
  where,
  onSnapshot,
  getFirestore,
  orderBy,
  Query,
} from "firebase/firestore";
import { app } from "../../../firebase-config";

const User = () => {
  const [user, setUser] = useState<User>({
    email: "",
    username: "",
    userid: "",
    projects: [],
  });
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<string>("");
  const [currentProjectName, setCurrentProjectName] = useState<string>("");
  const [currentProjectMembers, setCurrentProjectMembers] = useState<string[]>(
    []
  );

  const db = getFirestore(app) as any;

  const getProjects = async (userid: string) => {
    const docRef = query(
      collection(db, "projects"),
      where("users", "array-contains", userid),
      orderBy("created", "desc")
    );
    onSnapshot(docRef, (querySnapshot) => {
      let data = [] as any[];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setProjectList(data);
      setCurrentProject(data[0].projectid);
      setCurrentProjectName(data[0].name);
      setCurrentProjectMembers(data[0].users);
    });
  };

  const userData = async (userid: string) => {
    const newuser = await getUser(userid);
    setUser({
      email: newuser!.email,
      username: newuser!.username,
      userid: userid,
      projects: newuser!.projects,
    });
  };

  useEffect(() => {
    const auth = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        userData(user!.uid);
        getProjects(user!.uid);
      }
    });
    return auth;
  }, []);

  const projectSetter = (projectid: string) => {
    setCurrentProject(projectid);
    const newproject = projectList.find(
      (element) => element.projectid === projectid
    );
    if (newproject) {
      setCurrentProjectMembers(newproject.users);
    }
  };

  return (
    <div className={styles.page}>
      <Header
        user={user}
        projectid={currentProject}
        projectname={currentProjectName}
        collaboratorsArray={currentProjectMembers}
      >
        <ProjectDropdown
          projectList={projectList}
          projectSetter={projectSetter}
        />
      </Header>
      <Sidebar
        user={user}
        projectlist={projectList}
        projectid={currentProject}
      />
      <div className="project__container">
        <Canvas project={currentProject} projectList={projectList}>
          {" "}
        </Canvas>
      </div>
    </div>
  );
};

export default User;
