import { Timestamp } from "firebase/firestore";
import { Layout } from "react-grid-layout";

export type User = {
  email: string;
  username: string;
  userid: string;
  projects: string[];
};

export type Project = {
  name: string;
  users: string[];
  created: Timestamp;
  projectid: string;
};

export type WidgetType = {
  date: any;
  projectid: string[];
  widgetid: string;
  priority: string;
  layout: string;
  postits: string;
  textboxes: string;
};

export type Invited = {
  projectname: string;
  projectid: string;
  userinvitingname: string;
  userinvitingid: string;
  invitationuid: string;
  created: Timestamp;
};

export type UserUpdate = {
  projectname: string;
  projectid: string;
  usersendingupdate: string;
  usermessage: string;
  updateuid: string;
  created: Timestamp;
};

export type Postit = {
  id: string;
  postittext: string;
};

export type Textbox = {
  id: string;
  text: string;
};

export type WhiteboardImage = {
  id: string;
  file: string;
};
