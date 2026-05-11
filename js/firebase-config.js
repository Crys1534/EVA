// Importamos solo lo que necesitamos para ahorrar espacio (Modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBnX__R6A6lQw_KuzZxqHRkzZyj10S_4wU",
  authDomain: "aula-virtual-79e4d.firebaseapp.com",
  databaseURL: "https://aula-virtual-79e4d-default-rtdb.firebaseio.com",
  projectId: "aula-virtual-79e4d",
  storageBucket: "aula-virtual-79e4d.firebasestorage.app",
  messagingSenderId: "384731632952",
  appId: "1:384731632952:web:9b4facff98bc7f6ebf5dcd",
  measurementId: "G-SR9D2CJX40"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);