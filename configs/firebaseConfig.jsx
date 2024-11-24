// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "kunno-dd4aa.firebaseapp.com",
  projectId: "kunno-dd4aa",
  storageBucket: "kunno-dd4aa.firebasestorage.app",
  messagingSenderId: "5541256538",
  appId: "1:5541256538:web:ea8a429c07261618106763",
  measurementId: "G-KQLSJQV8WL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
const db = getFirestore(app);

export { db };
