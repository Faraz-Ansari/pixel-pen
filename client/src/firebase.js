// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "pixel-pen-bf944.firebaseapp.com",
    projectId: "pixel-pen-bf944",
    storageBucket: "pixel-pen-bf944.firebasestorage.app",
    messagingSenderId: "544403199618",
    appId: "1:544403199618:web:4b58ddde911eb2e0f1069b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
