// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAGIZLk_cSfqJrt_FyzXQ5zklN4FRRf51k",
    authDomain: "bookhunt-4c352.firebaseapp.com",
    projectId: "bookhunt-4c352",
    storageBucket: "bookhunt-4c352.firebasestorage.app",
    messagingSenderId: "703848722492",
    appId: "1:703848722492:web:2e516ff8b5b1fe9acc9339",
    measurementId: "G-9NZGBN5TC9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
//const analytics = getAnalytics(app);

export { app, auth };