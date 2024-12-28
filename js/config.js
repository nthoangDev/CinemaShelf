// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js"
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";


export const TMDB_API_KEY = "dbbaa5f1980d9ed78b340fa5d2446ddd";


const firebaseConfig = {
    apiKey: "AIzaSyCpauXb1wgTrB64DnuHxAIFsWSI3GiMtcI",
    authDomain: "myproject-d0fe8.firebaseapp.com",
    projectId: "myproject-d0fe8",
    storageBucket: "myproject-d0fe8.firebasestorage.app",
    messagingSenderId: "207058849955",
    appId: "1:207058849955:web:7af6e084c4252808632f16",
    measurementId: "G-T53XYT2R0L",
    databaseURL: "https://myproject-d0fe8-default-rtdb.firebaseio.com/"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth, db }