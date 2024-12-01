// Importa las funciones necesarias del SDK de Firebase
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Importa Storage
import { getDatabase } from "firebase/database"; // Importa Realtime Database

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAaMNIc8A7u22E4k5mMnI9hn-0SH6GgY78",
  authDomain: "togs-cc569.firebaseapp.com",
  databaseURL: "https://togs-cc569-default-rtdb.firebaseio.com",
  projectId: "togs-cc569",
  storageBucket: "togs-cc569.appspot.com",
  messagingSenderId: "721742431560",
  appId: "1:721742431560:web:da432341f2876e79e45f7d",
  measurementId: "G-E0GRPV3YGB",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta las instancias necesarias
export const realtimeDb = getDatabase(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // Exporta Storage
