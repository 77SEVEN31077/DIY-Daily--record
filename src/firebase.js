import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getFirestore, collection, addDoc, query, orderBy, getDocs, Timestamp, where 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import {
    getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
    signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyDub01y9nvtEKGrVg6DWLYVwVlBs2YFgxs",
  authDomain: "diy-daily-record.firebaseapp.com",
  projectId: "diy-daily-record",
  storageBucket: "diy-daily-record.firebasestorage.app",
  messagingSenderId: "1030894380378",
  appId: "1:1030894380378:web:16b1ce08b6a4e51f1e3f63",
  measurementId: "G-NPT3TLF0PK"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, Timestamp, collection, addDoc, query, orderBy, getDocs, where };
