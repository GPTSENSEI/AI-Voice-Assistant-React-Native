import * as firebase from "firebase/app";
// import firebase from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "firebase/storage";
import { getApps, initializeApp } from "firebase/app";
// import { getFirestore, collection, getDocs } from "firebase/firestore/lite";

// if (getApps().length < 1) {
//   initializeApp(firebaseConfig);
// Initialize other firebase products here
// }

const firebaseConfig = {
  apiKey: "AIzaSyDdU9u1b1BIXtLbpt590Qd6R6A-hSm_cQk",
  authDomain: "gptsensei-new.firebaseapp.com",
  projectId: "gptsensei-new",
  storageBucket: "gptsensei-new.appspot.com",
  messagingSenderId: "965370123238",
  appId: "1:965370123238:web:405b07adfb0bebae717c27",
};

let app;
if (getApps().length < 1) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
