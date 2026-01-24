import { db } from "../firebase/firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");
  const submitBtn = document.getElementById("submitBtn");

  if (!form) {
    console.error("❌ contactForm not found");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    // Basic email regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !message) {
      showStatus("⚠️ All fields are required", "error");
      return;
    }

    if (!emailRegex.test(email)) {
      showStatus("⚠️ Please enter a valid email address", "error");
      return;
    }

    // Loading state
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    showStatus("Sending your message...", "info");

    try {
      await addDoc(collection(db, "contactMessages"), {
        name,
        email,
        message,
        createdAt: serverTimestamp()
      });

      showStatus("✅ Message sent successfully! We’ll get back to you soon.", "success");
      form.reset();

    } catch (error) {
      console.error("❌ Firestore Error:", error);
      showStatus("❌ Failed to send message. Please try again.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    }
  });

  function showStatus(text, type) {
    status.classList.remove("hidden");
    status.textContent = text;

    status.className =
      "text-sm font-medium p-3 rounded " +
      (type === "success"
        ? "bg-green-100 text-green-700"
        : type === "error"
        ? "bg-red-100 text-red-700"
        : "bg-blue-100 text-blue-700");
  }
});
