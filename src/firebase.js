// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// firestore 등 추가
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBlLDgRbuzdLyBS_B9YZ_wTm5veS5-Htp8",
  authDomain: "realtor-web-9443f.firebaseapp.com",
  projectId: "realtor-web-9443f",
  storageBucket: "realtor-web-9443f.appspot.com",
  messagingSenderId: "191857288267",
  appId: "1:191857288267:web:daf8ec7fd400fb2fd359ce",
  measurementId: "G-GZKVFQ7RVV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// firestore 등 추가
export const db = getFirestore(app);
export const auth = getAuth(app);
