import { getAuth } from "firebase/auth";
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { app } from "../../../../firebase-config";
import { v4 } from "uuid";

const db = getFirestore(app) as any;

export const getUser = async (userid: string) => {
  const docRef = doc(db, "users", `${userid}`);
  const docSnap = await getDoc(docRef);

  if (docSnap) {
    const data = await docSnap.data();
    return data;
  } else {
    console.log("No such document!");
  }
};

export const getCanvas = async (projectid: string) => {
  const docRef = doc(db, "canvas", `${projectid}`);
  const docSnap = await getDoc(docRef);

  if (docSnap) {
    const data = await docSnap.data();
    return data;
  } else {
    console.log("No such document!");
  }
};

export const AddProject = async (name: string, userid: string) => {
  const uuid = v4();
  await setDoc(doc(db, "projects", `${uuid}`), {
    name,
    projectid: uuid,
    users: [userid],
    created: serverTimestamp()
  });
  const docRef = doc(db, "users", userid);
  await updateDoc(docRef, {
    projects: arrayUnion(uuid),
  });
  return name;
};

export const AddWidget = async (date: Date, projectid: string) => {
  const uuid = v4();
  await setDoc(doc(db, "widgets", `${uuid}`), {
    date: Timestamp.fromDate(new Date(date)),
    widgetid: uuid,
    projectid,
    priority: 'medium',
  });
  return date;
};
