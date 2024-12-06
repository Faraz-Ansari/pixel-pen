// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-auth-2696d.firebaseapp.com",
    projectId: "mern-auth-2696d",
    storageBucket: "mern-auth-2696d.appspot.com",
    messagingSenderId: "160687227676",
    appId: "1:160687227676:web:b0a9295aeb4bb4abc470d9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
