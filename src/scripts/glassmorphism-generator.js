document.addEventListener("DOMContentLoaded", () => {
    
    // Elements
    const glassPreview = document.getElementById("glassPreview");
    const codeOutput = document.getElementById("codeOutput");
    const copyBtn = document.getElementById("copyBtn");

    // Inputs
    const inOpacity = document.getElementById("inOpacity");
    const inBlur = document.getElementById("inBlur");
    const inSaturation = document.getElementById("inSaturation");
    const inBorder = document.getElementById("inBorder");
    
    // Labels
    const valOpacity = document.getElementById("valOpacity");
    const valBlur = document.getElementById("valBlur");
    const valSaturation = document.getElementById("valSaturation");
    const valBorder = document.getElementById("valBorder");

    // Theme Buttons
    const btnLight = document.getElementById("btnLight");
    const btnDark = document.getElementById("btnDark");

    // State
    let isLightMode = true;

    // Helper: Convert opacity 0-1 to rounded percentage for class name (e.g. 0.5 -> 50)
    // Note: Tailwind default opacity scale has specific steps, but we will use arbitrary values for the generator precision.
    
    function updateGlass() {
        const opacity = inOpacity.value;
        const blur = inBlur.value;
        const saturation = inSaturation.value;
        const borderAlpha = inBorder.value;

        // Update Labels
        valOpacity.textContent = opacity;
        valBlur.textContent = `${blur}px`;
        valSaturation.textContent = `${saturation}%`;
        valBorder.textContent = borderAlpha;

        // Base Classes
        const baseClasses = "relative w-80 h-48 p-6 flex flex-col justify-between rounded-xl shadow-lg transition-all duration-300 border";
        
        // Color Logic
        const colorBase = isLightMode ? "255, 255, 255" : "0, 0, 0";
        const textColor = isLightMode ? "text-gray-800" : "text-white";
        const borderColor = isLightMode ? "255, 255, 255" : "255, 255, 255"; // Borders usually look best white-ish even in dark mode for glass

        // Apply Styles to Preview Element directly (Visuals)
        glassPreview.className = `${baseClasses} ${textColor}`;
        glassPreview.style.backgroundColor = `rgba(${colorBase}, ${opacity})`;
        glassPreview.style.backdropFilter = `blur(${blur}px) saturate(${saturation}%)`;
        glassPreview.style.borderColor = `rgba(${borderColor}, ${borderAlpha})`;

        // Generate Tailwind Classes (Output)
        // We use arbitrary values ([...]) to ensure the user gets exactly what they see in the sliders.
        const bgClass = isLightMode ? `bg-white/[${opacity}]` : `bg-black/[${opacity}]`;
        const blurClass = `backdrop-blur-[${blur}px]`;
        const saturateClass = saturation !== "100" ? `backdrop-saturate-[${saturation/100}]` : ""; // Tailwind saturate is multiplier (1.5) or arbitrary
        const borderClass = `border-white/[${borderAlpha}]`;
        
        let generatedClass = `${bgClass} ${blurClass} ${borderClass} rounded-xl shadow-lg`;
        if (saturation !== "100") {
            generatedClass += ` backdrop-saturate-[${(saturation/100).toFixed(2)}]`;
        }

        codeOutput.textContent = generatedClass.replace(/\s+/g, ' ').trim();
    }

    // Theme Switching
    btnLight.addEventListener("click", () => {
        isLightMode = true;
        btnLight.classList.add("border-[#049b9f]", "bg-blue-50", "text-[#049b9f]");
        btnLight.classList.remove("border-gray-200", "text-gray-500");
        
        btnDark.classList.remove("border-[#049b9f]", "bg-blue-50", "text-[#049b9f]");
        btnDark.classList.add("border-gray-200", "text-gray-500");
        updateGlass();
    });

    btnDark.addEventListener("click", () => {
        isLightMode = false;
        btnDark.classList.add("border-[#049b9f]", "bg-blue-50", "text-[#049b9f]");
        btnDark.classList.remove("border-gray-200", "text-gray-500");
        
        btnLight.classList.remove("border-[#049b9f]", "bg-blue-50", "text-[#049b9f]");
        btnLight.classList.add("border-gray-200", "text-gray-500");
        updateGlass();
    });

    // Event Listeners
    [inOpacity, inBlur, inSaturation, inBorder].forEach(el => {
        el.addEventListener("input", updateGlass);
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

    // --- RATING SYSTEM (Standard) ---
    const TOOL_KEY = "glass-generator-rating";
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
    updateGlass();
});