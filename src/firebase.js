import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyADiV7PL_gcnygsKYE3Sw5pRI6me8EwkpE",
  authDomain: "track-79341.firebaseapp.com",
  projectId: "track-79341",
  storageBucket: "track-79341.firebasestorage.app",
  messagingSenderId: "184469882180",
  appId: "1:184469882180:web:794dda55df2f853c944311"
};
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export { storage };