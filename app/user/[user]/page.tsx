"use client";

import React, { useEffect, useState } from "react";
import Widget from "./components/Widget";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import ProjectDropdown from "./components/ProjectDropdown";
import MonthContainer from "./components/MonthContainer";
import Canvas from "./components/Canvas";
import styles from "./userpage.module.css";
import { getUser, getProjects } from "./utils/getMethods";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { User, Project } from "../../Types";

const User = () => {
  const [user, setUser] = useState<User>({
    email: "",
    username: "",
    userid: "",
  });
  const [projectList, setProjectList] = useState<Project[]>([]);

  const userData = async (userid: string) => {
    const newuser = await getUser(userid);
    const projects = await getProjects(userid);
    setUser({
      email: newuser!.email,
      username: newuser!.username,
      userid: userid,
    });
    setProjectList(projects);
  };

  useEffect(() => {
    const auth = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        userData(user!.uid);
      }
    });
    return auth;
  }, []);

  return (
    <div className={styles.page}>
      <Header user={user}>
        <ProjectDropdown projectList={projectList} />
      </Header>
      <Sidebar />
      <div className="canvas__container">
        <Canvas>
          <MonthContainer>
            <Widget />
          </MonthContainer>
        </Canvas>
      </div>
    </div>
  );
};

export default User;
