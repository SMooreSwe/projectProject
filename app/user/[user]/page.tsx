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
} from "firebase/firestore";
import { app } from "../../../firebase-config";

const User = () => {
  const [user, setUser] = useState<User>({
    email: "",
    username: "",
    userid: "",
  });
  const [projectList, setProjectList] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<string>("");

  const db = getFirestore(app) as any;

  const getProjects = async (userid: string) => {
    const docRef = query(
      collection(db, "projects"),
      where("users", "array-contains", userid)
    );
    onSnapshot(docRef, (querySnapshot) => {
      let data = [] as any[];
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      setProjectList(data);
    });
  };

  const userData = async (userid: string) => {
    const newuser = await getUser(userid);
    setUser({
      email: newuser!.email,
      username: newuser!.username,
      userid: userid,
    });
  };

  useEffect(() => {
    const auth = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        userData(user!.uid);
        getProjects(user!.uid);
      }
    });
    console.log(currentProject);
    return auth;
  }, []);

  const projectSetter = (projectid: string) => {
    setCurrentProject(projectid);
  };

  return (
    <div className={styles.page}>
      <Header user={user} projectid={currentProject}>
        <ProjectDropdown
          projectList={projectList}
          projectSetter={projectSetter}
        />
      </Header>
      <Sidebar />
      <div className="project__container">
        <Canvas project={currentProject}>
        </Canvas>
      </div>
    </div>
  );
};

export default User;
