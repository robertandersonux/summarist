import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyDasWxjsa1xpUJud9KlsanKU_543zMSaLE",
  authDomain: "summarist-6823b.firebaseapp.com",
  projectId: "summarist-6823b",
  storageBucket: "summarist-6823b.firebasestorage.app",
  messagingSenderId: "875904376481",
  appId: "1:875904376481:web:30f1d95e4423df4c259ae0",
  measurementId: "G-FJS63C5EEM",
};
 
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
 
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;