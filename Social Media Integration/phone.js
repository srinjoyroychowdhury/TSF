import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";

import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
import {
    getFirestore, doc, setDoc
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";

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

auth.languageCode = 'it';

window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {});
recaptchaVerifier.render().then((widgetId) => {
    window.recaptchaWidgetId = widgetId;
});

const getCodeButton = document.getElementById('getCode');

getCodeButton.addEventListener('click', function (event) {
    event.preventDefault();
    const phoneNumber = "+91" + document.getElementById('phoneNumber').value;
    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
        })
        .catch((error) => {
            console.log(error);
        });
});

const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const code = document.getElementById('code').value;
    confirmationResult.confirm(code)
        .then(async (result) => {
            // User signed in successfully.
            alert("Signed in successfully");
            const user = result.user;
            console.log('User details:', user);

            // Add user data to Firestore
            const db = getFirestore();
            const data = {
                useruid: user.uid,
                userdisplayname: user.displayName || "N/A",
                userphotourl: user.photoURL || "N/A",
                useremail: user.email || "N/A",
                userphone: user.phoneNumber || "N/A",
                usergender: "N/A",
                useraddress: "N/A",
                userorganization: "N/A",
                userdesignation: "N/A"
            };

            const docRef = doc(db, "userlist", user.uid);

            try {
                await setDoc(docRef, data);
                console.log("Data added to Firestore successfully.");
                window.location.href = 'userdetails.html';
            } catch (error) {
                console.error("Error adding data to Firestore:", error);
            }
        })
        .catch((error) => {
            // User couldn't sign in (bad verification code?)
            console.log(error);
        });
});
