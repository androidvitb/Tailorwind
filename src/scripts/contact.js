import { db } from "../firebase/firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");

  if (!form) {
    console.error("❌ contactForm not found in DOM");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // ⛔ STOP PAGE RELOAD

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
      alert("⚠️ All fields are required");
      return;
    }

    try {
      await addDoc(collection(db, "contactMessages"), {
        name,
        email,
        message,
        createdAt: serverTimestamp()
      });

      alert("✅ Message sent successfully!");
      form.reset();
    } catch (error) {
      console.error("❌ Firestore Error:", error);
      alert("❌ Failed to send message");
    }
  });
});
