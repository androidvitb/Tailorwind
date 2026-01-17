import { auth } from "/src/firebase/firebase.js";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Email login
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (!email || !password) {
        alert("Email and password required");
        return;
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login successful!");
        window.location.href = "/src/pages/tools-and-generator.html";
    } catch (error) {
        alert("Invalid credentials");
    }
});

// Google login
document.querySelector(".google-signin").addEventListener("click", async () => {
    try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        window.location.href = "/src/pages/tools-and-generator.html";
    } catch (error) {
        alert(error.message);
    }
});



  const TOOL_KEY = "color-palette-rating";

  let ratingData = JSON.parse(localStorage.getItem(TOOL_KEY)) || {
    totalScore: 0,
    totalRatings: 0
  };

  const stars = document.querySelectorAll(".star");
  const avgEl = document.getElementById("avgRating");
  const countEl = document.getElementById("ratingCount");

  let selectedRating = 0;

  function updateStats() {
    const avg = ratingData.totalRatings
      ? (ratingData.totalScore / ratingData.totalRatings).toFixed(1)
      : "0.0";

    avgEl.textContent = avg;
    countEl.textContent = ratingData.totalRatings;
  }

  function fillStars(value) {
    stars.forEach(star => {
      const starValue = Number(star.dataset.value);
      if (starValue <= value) {
        star.classList.remove("fa-regular");
        star.classList.add("fa-solid", "text-yellow-400");
      } else {
        star.classList.remove("fa-solid", "text-yellow-400");
        star.classList.add("fa-regular");
      }
    });
  }

  stars.forEach(star => {
    // Hover effect
    star.addEventListener("mouseenter", () => {
      fillStars(star.dataset.value);
    });

    // Reset on mouse leave
    star.addEventListener("mouseleave", () => {
      fillStars(selectedRating);
    });

    // Click to rate
    star.addEventListener("click", () => {
      selectedRating = Number(star.dataset.value);

      ratingData.totalScore += selectedRating;
      ratingData.totalRatings += 1;

      localStorage.setItem(TOOL_KEY, JSON.stringify(ratingData));

      fillStars(selectedRating);
      updateStats();
    });
  });

  updateStats();



