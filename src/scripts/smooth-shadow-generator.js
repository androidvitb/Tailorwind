document.addEventListener("DOMContentLoaded", () => {
    
    // Elements
    const shadowPreview = document.getElementById("shadowPreview");
    const codeOutput = document.getElementById("codeOutput");
    const copyBtn = document.getElementById("copyBtn");

    // Inputs
    const inLayers = document.getElementById("inLayers");
    const inAlpha = document.getElementById("inAlpha");
    const inY = document.getElementById("inY");
    const inX = document.getElementById("inX");
    const inBlur = document.getElementById("inBlur");
    const inCurve = document.getElementById("inCurve");

    // Labels
    const valLayers = document.getElementById("valLayers");
    const valAlpha = document.getElementById("valAlpha");
    const valY = document.getElementById("valY");
    const valX = document.getElementById("valX");
    const valBlur = document.getElementById("valBlur");

    function updateShadow() {
        const layers = parseInt(inLayers.value);
        const finalAlpha = parseFloat(inAlpha.value);
        const finalY = parseInt(inY.value);
        const finalX = parseInt(inX.value);
        const finalBlur = parseInt(inBlur.value);
        const curve = parseFloat(inCurve.value);

        // Update Labels
        valLayers.textContent = layers;
        valAlpha.textContent = finalAlpha;
        valY.textContent = `${finalY}px`;
        valX.textContent = `${finalX}px`;
        valBlur.textContent = `${finalBlur}px`;

        let shadows = [];
        let tailwindShadows = [];

        // ALGORITHM:
        // We iterate from 1 to 'layers'.
        // For each layer, we calculate a fraction 't' (progress).
        // We apply an easing curve (t^curve) to that fraction to distribute shadows non-linearly.
        
        for (let i = 1; i <= layers; i++) {
            const t = i / layers;
            
            // Interpolation Logic
            const ease = Math.pow(t, curve); // The "Smooth" magic happens here

            const y = (finalY * ease).toFixed(1);
            const x = (finalX * ease).toFixed(1);
            const blur = (finalBlur * ease).toFixed(1);
            
            // Alpha usually stays roughly constant per layer in layered shadow techniques
            // or scales slightly. We'll use the fixed input alpha for cleaner stacking.
            const alpha = finalAlpha; 

            // Standard CSS Shadow string
            shadows.push(`${x}px ${y}px ${blur}px rgba(0, 0, 0, ${alpha})`);

            // Tailwind Arbitrary Shadow string
            // Format: x_y_blur_color
            // Note: In Tailwind arbitrary values, spaces must be underscores
            tailwindShadows.push(`${x}px_${y}px_${blur}px_rgba(0,0,0,${alpha})`);
        }

        const cssString = shadows.join(", ");
        const twString = `shadow-[${tailwindShadows.join(",")}]`;

        // Apply to Preview
        shadowPreview.style.boxShadow = cssString;

        // Output Code
        codeOutput.textContent = twString;
    }

    // --- EVENT LISTENERS ---
    const inputs = [inLayers, inAlpha, inY, inX, inBlur, inCurve];
    inputs.forEach(input => {
        input.addEventListener("input", updateShadow);
    });

    copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(codeOutput.textContent);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "Copied!";
        copyBtn.classList.replace("bg-blue-600", "bg-green-600");
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.classList.replace("bg-green-600", "bg-blue-600");
        }, 2000);
    });

    // --- RATING SYSTEM ---
    const TOOL_KEY = "smooth-shadow-rating";
    let ratingData = JSON.parse(localStorage.getItem(TOOL_KEY)) || { totalScore: 0, totalRatings: 0 };
    const stars = document.querySelectorAll(".star");
    const avgEl = document.getElementById("avgRating");
    const countEl = document.getElementById("ratingCount");
    let selectedRating = 0;

    function updateStats() {
        const avg = ratingData.totalRatings ? (ratingData.totalScore / ratingData.totalRatings).toFixed(1) : "0.0";
        avgEl.textContent = avg;
        countEl.textContent = ratingData.totalRatings;
    }

    function fillStars(value) {
        stars.forEach(star => {
            const starValue = Number(star.dataset.value);
            if (starValue <= value) {
                star.classList.replace("fa-regular", "fa-solid");
                star.classList.add("text-yellow-400");
                star.classList.remove("text-gray-300");
            } else {
                star.classList.replace("fa-solid", "fa-regular");
                star.classList.remove("text-yellow-400");
                star.classList.add("text-gray-300");
            }
        });
    }

    stars.forEach(star => {
        star.addEventListener("mouseenter", () => fillStars(star.dataset.value));
        star.addEventListener("mouseleave", () => fillStars(selectedRating));
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
    
    // Init
    updateShadow();
});