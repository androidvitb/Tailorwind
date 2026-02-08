document.addEventListener("DOMContentLoaded", () => {
    
    // Elements
    const previewText = document.getElementById("previewText");
    const currentSize = document.getElementById("currentSize");
    const formulaDisplay = document.getElementById("formulaDisplay");
    
    // Outputs
    const codeOutput = document.getElementById("codeOutput");
    const cssOutput = document.getElementById("cssOutput");
    const copyBtn = document.getElementById("copyBtn");

    // Inputs
    const inMinW = document.getElementById("inMinW");
    const inMaxW = document.getElementById("inMaxW");
    const inMinF = document.getElementById("inMinF");
    const inMaxF = document.getElementById("inMaxF");
    const inRemBase = document.getElementById("inRemBase");

    function calculateFluid() {
        const minW = parseFloat(inMinW.value);
        const maxW = parseFloat(inMaxW.value);
        const minF = parseFloat(inMinF.value);
        const maxF = parseFloat(inMaxF.value);
        const remBase = parseFloat(inRemBase.value);

        if (minW >= maxW || minF >= maxF) {
            formulaDisplay.textContent = "Error: Max values must be greater than Min values.";
            return;
        }

        // 1. Convert pixels to REMs
        const minFR = minF / remBase;
        const maxFR = maxF / remBase;
        const minWR = minW / remBase;
        const maxWR = maxW / remBase;

        // 2. Calculate Slope and Intersection
        // Formula: size = slope * viewport + intersection
        const slope = (maxFR - minFR) / (maxWR - minWR);
        const intersection = -minWR * slope + minFR;

        // 3. Format values for CSS
        const slopeVW = (slope * 100).toFixed(4);
        const intersectionREM = intersection.toFixed(4);

        // 4. Construct Clamp
        // clamp(MIN, PREFERRED, MAX)
        // Preferred = intersection + slope * vw
        const clampVal = `clamp(${minFR.toFixed(4)}rem, ${intersectionREM}rem + ${slopeVW}vw, ${maxFR.toFixed(4)}rem)`;

        // Update DOM
        formulaDisplay.textContent = `Slope: ${slopeVW}, Intersect: ${intersectionREM}`;
        previewText.style.fontSize = clampVal;
        cssOutput.textContent = `font-size: ${clampVal};`;

        // Generate Tailwind Config
        const tailwindConfig = `
module.exports = {
  theme: {
    extend: {
      fontSize: {
        'fluid-base': '${clampVal}',
      }
    }
  }
}`;
        codeOutput.textContent = tailwindConfig.trim();
        updateComputedSize();
    }

    // Monitor actual size on screen resize
    function updateComputedSize() {
        const style = window.getComputedStyle(previewText);
        currentSize.textContent = style.fontSize;
    }

    window.addEventListener("resize", updateComputedSize);

    // --- EVENT LISTENERS ---
    [inMinW, inMaxW, inMinF, inMaxF, inRemBase].forEach(input => {
        input.addEventListener("input", calculateFluid);
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
    const TOOL_KEY = "fluid-type-rating";
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
    calculateFluid();
});