import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-analytics.js";
import {
    getFirestore, doc, getDoc, setDoc, collection, addDoc, updateDoc
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider, GithubAuthProvider } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const signinForm = document.getElementById('signin-form');
const db = getFirestore();
auth.languageCode = 'it';
auth.useDeviceLanguage();
signinForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent form submission

    const email = signinForm['emailin'].value;
    const password = signinForm['passwordin'].value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            alert('Sign in successful!'); // You can replace this with your desired success handling
            console.log('User details:', user);
            window.location.href = 'userdetails.html';

        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Sign in error: ${errorMessage}`);
        });
});
const googleSignInButton = document.getElementById('google-signin-button');
googleSignInButton.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();

    // Sign in with Google using a popup
    signInWithPopup(auth, provider)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;

            console.log('User details:', user.uid);

            // Define a function to add data to Firestore and return a Promise
            async function addDataToFirestore() {
                const data = {
                    useruid: user.uid,
                    userdisplayname: user.displayName,
                    userphotourl: user.photoURL,
                    useremail: user.email,
                    userphone: user.phoneNumber,
                    usergender: "N/A",
                    useraddress: "N/A",
                    userorganization: "N/A",
                    userdesignation: "N/A"
                };

                const docRef = doc(db, "userlist", user.uid);

                try {
                    const docSnapshot = await getDoc(docRef);
                    if (!docSnapshot.exists()) {
                        await setDoc(docRef, data);
                        console.log("Data added since the document didn't exist.");
                    } else {
                        console.log("Document already exists. No data added.");
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }

            // Call the function to add data to Firestore and wait for it to complete
            addDataToFirestore()
                .then(() => {
                    // After adding data to Firestore is complete, show alert and redirect
                    alert('Sign in with Google successful!');
                    window.location.href = 'userdetails.html';
                })
                .catch((error) => {
                    const errorCode = error.code;
                    const errorMessage = error.message;
                    alert(`Error adding data to Firestore: ${errorMessage}`);
                });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(`Sign in with Google error: ${errorMessage}`);
        });
});
const phonelogin = document.getElementById("phonelogin")
phonelogin.addEventListener('click', () => {
    window.location.href = 'loginwithphone.html';
})

const fb = document.getElementById('fb')

fb.addEventListener('click', () => {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;

            // Add user data to Firestore
            createUserCollectionfb(user);

            alert('Sign in with Facebook successful!');
            window.location.href = 'userdetails.html';

            // IdP data available using getAdditionalUserInfo(result)
            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);

            // ...
        });
});

function createUserCollectionfb(user) {
    // Add user data to Firestore
    const db = getFirestore();
    const data = {
        useruid: user.uid,
        userdisplayname: user.displayName || "N/A",
        userphotourl: user.photoURL || "N/A",
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
        })
        .catch((error) => {
            console.error("Error adding user data to Firestore:", error);
        });
}

const github = document.getElementById('github');

github.addEventListener('click', () => {
    const provider = new GithubAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a GitHub Access Token. You can use it to access the GitHub API.
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            // The signed-in user info.
            const user = result.user;

            // Add user data to Firestore
            createUserCollectiongit(user);

            alert('Sign in with GitHub was successful!');
            window.location.href = 'userdetails.html';

            // IdP data available using getAdditionalUserInfo(result)
            // ...
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GithubAuthProvider.credentialFromError(error);

            alert("Error signing in with GitHub");
            console.log(error);
            // ...
        });
});

function createUserCollectiongit(user) {
    // Add user data to Firestore
    const db = getFirestore();
    const data = {
        useruid: user.uid,
        userdisplayname: user.displayName || "N/A",
        userphotourl: user.photoURL || "N/A",
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
        })
        .catch((error) => {
            console.error("Error adding user data to Firestore:", error);
        });
}



