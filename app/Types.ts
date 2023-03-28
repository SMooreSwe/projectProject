import { Timestamp } from "firebase/firestore";

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
};

export type Invited = {
  projectname: string,
  projectid: string,
  userinviting: string,
  invitationuid: string,
  created: Timestamp
}
