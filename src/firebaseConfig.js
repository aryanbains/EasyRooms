import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyDPkCWgt22btPIurKHyjNdYS4Sl1encj5I",
    authDomain: "easyrooms-6a397.firebaseapp.com",
    projectId: "easyrooms-6a397",
    storageBucket: "easyrooms-6a397.appspot.com",
    messagingSenderId: "505231531118",
    appId: "1:505231531118:web:7693c77703bf382167da7f",
    measurementId: "G-V71SG41WCG"
  };  

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
