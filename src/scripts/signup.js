import { auth } from "/src/firebase/firebase.js";
import {
    createUserWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Email signup
document.getElementById("emailSignupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("signupEmail").value;
    const password = document.getElementById("signupPassword").value;

    if (!email || !password) {
        alert("Email and password are required");
        return;
    }

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created successfully!");
        window.location.href = "/src/pages/tools-and-generator.html";
    } catch (error) {
        alert(error.message);
    }
});

// Google signup
document.querySelector(".google-button").addEventListener("click", async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        window.location.href = "/src/pages/tools-and-generator.html";
    } catch (error) {
        alert(error.message);
    }
});
