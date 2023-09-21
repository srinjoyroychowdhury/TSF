// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";

import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDdNA85YFPLf8M3xO47wW-CE1O5UUBuOsk",
    authDomain: "userpage-33951.firebaseapp.com",
    projectId: "userpage-33951",
    storageBucket: "userpage-33951.appspot.com",
    messagingSenderId: "950594980527",
    appId: "1:950594980527:web:f536a29d10ed440367625a",
    measurementId: "G-3YBFCE7D36"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const signupForm = document.getElementById('signup-form');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = signupForm['email'].value;
    const password = signupForm['password'].value;

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up successfully
            const user = userCredential.user;

            alert('Sign up successful!'); // You can replace this with your desired success handling
            createUserCollection(user);

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Sign up error: ${errorMessage}`);
        });
});

function createUserCollection(user) {
    // Add user data to Firestore
    const db = getFirestore();
    const data = {
        useruid: user.uid,
        userdisplayname: "N/A", // You can customize this
        userphotourl: "N/A",     // You can customize this
        useremail: user.email || "N/A",
        userphone: "N/A",        // You can customize this
        usergender: "N/A",       // You can customize this
        useraddress: "N/A",      // You can customize this
        userorganization: "N/A", // You can customize this
        userdesignation: "N/A"   // You can customize this
    };

    const docRef = doc(db, "userlist", user.uid);

    setDoc(docRef, data)
        .then(() => {
            console.log("User data added to Firestore successfully.");
            window.location.href = 'login.html';
        })
        .catch((error) => {
            console.error("Error adding user data to Firestore:", error);
        });
}
