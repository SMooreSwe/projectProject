import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../../../firebase-config";

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

export const getProjects = async (userid: string) => {
  const docRef = query(
    collection(db, "projects"),
    where("users", "array-contains", userid)
  );
  const querySnapshot = await getDocs(docRef);
  const data = [] as any[];
  querySnapshot.forEach((doc) => {
    data.push(doc.data());
  });
  return data;
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
