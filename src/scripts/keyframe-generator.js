document.addEventListener("DOMContentLoaded", () => {
    let keyframes = [
        { pct: 0, x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 },
        { pct: 100, x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }
    ];
    let selectedStepIndex = 0; 

    const stepsContainer = document.getElementById("stepsContainer");
    const addStepBtn = document.getElementById("addStepBtn");
    const deleteStepBtn = document.getElementById("deleteStepBtn");
    const currentStepLabel = document.getElementById("currentStepLabel");
    
    // Inputs
    const propX = document.getElementById("propX");
    const propY = document.getElementById("propY");
    const propScale = document.getElementById("propScale");
    const propRotate = document.getElementById("propRotate");
    const propOpacity = document.getElementById("propOpacity");
    const propOpacityVal = document.getElementById("propOpacityVal");
    
    // Global Settings
    const animDuration = document.getElementById("animDuration");
    const animTiming = document.getElementById("animTiming");

    // Output & Preview
    const previewElement = document.getElementById("previewElement");
    const codeOutput = document.getElementById("codeOutput");
    const cssOutput = document.getElementById("cssOutput");
    
    // Inject dynamic style for preview
    const styleTag = document.createElement("style");
    document.head.appendChild(styleTag);

    // --- CORE FUNCTIONS ---

    function renderSteps() {
        stepsContainer.innerHTML = "";
        
        keyframes.sort((a, b) => a.pct - b.pct);

        keyframes.forEach((kf, index) => {
            const btn = document.createElement("button");
            const isSelected = index === selectedStepIndex;
            
            btn.className = `flex-shrink-0 px-4 py-2 rounded border transition text-sm font-medium ${
                isSelected 
                ? "bg-gray-800 text-white border-gray-800" 
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`;
            btn.textContent = `${kf.pct}%`;
            
            btn.addEventListener("click", () => {
                selectedStepIndex = index;
                loadStepData();
                renderSteps();
            });

            stepsContainer.appendChild(btn);
        });

        const currentKf = keyframes[selectedStepIndex];
        if (currentKf.pct === 0 || currentKf.pct === 100) {
            deleteStepBtn.classList.add("hidden");
        } else {
            deleteStepBtn.classList.remove("hidden");
        }

        currentStepLabel.textContent = `(${currentKf.pct}%)`;
    }

    function loadStepData() {
        const data = keyframes[selectedStepIndex];
        propX.value = data.x;
        propY.value = data.y;
        propScale.value = data.scale;
        propRotate.value = data.rotate;
        propOpacity.value = data.opacity;
        propOpacityVal.textContent = data.opacity;
    }

    function updateStateFromInputs() {
        const data = keyframes[selectedStepIndex];
        data.x = Number(propX.value) || 0;
        data.y = Number(propY.value) || 0;
        data.scale = Number(propScale.value) || 1;
        data.rotate = Number(propRotate.value) || 0;
        data.opacity = propOpacity.value; 
        
        propOpacityVal.textContent = data.opacity;
        generateCode();
    }

    // 4. Generate CSS & Tailwind Config
    function generateCode() {
        let cssKeyframes = "";
        
        keyframes.forEach(kf => {
            cssKeyframes += `
  ${kf.pct}% {
    transform: translate(${kf.x}px, ${kf.y}px) scale(${kf.scale}) rotate(${kf.rotate}deg);
    opacity: ${kf.opacity};
  }`;
        });

        const animName = "customAnim";
        const duration = animDuration.value;
        const timing = animTiming.value === "bounce" 
            ? "cubic-bezier(0.8, 0, 1, 1)" 
            : animTiming.value;
        const fullCss = `
@keyframes ${animName} {${cssKeyframes}
}
#previewElement {
    animation: ${animName} ${duration}s ${timing} infinite;
}`;
        styleTag.innerHTML = fullCss;
        const tailwindObj = `
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        custom_anim: {${cssKeyframes}
        }
      },
      animation: {
        custom_anim: 'custom_anim ${duration}s ${timing} infinite',
      }
    }
  }
}`;
        codeOutput.textContent = tailwindObj.trim();
        cssOutput.textContent = fullCss.trim();
    }

    // --- EVENT LISTENERS ---
    [propX, propY, propScale, propRotate, propOpacity, animDuration, animTiming].forEach(input => {
        input.addEventListener("input", updateStateFromInputs);
    });

    addStepBtn.addEventListener("click", () => {
        const existingPcts = keyframes.map(k => k.pct);
        let newPct = 50;
        
        if (existingPcts.includes(50)) {
            if (!existingPcts.includes(25)) newPct = 25;
            else if (!existingPcts.includes(75)) newPct = 75;
            else {
                 newPct = prompt("Enter percentage (0-100):", "50");
                 newPct = parseInt(newPct);
                 if (isNaN(newPct) || newPct < 0 || newPct > 100 || existingPcts.includes(newPct)) return;
            }
        }

        keyframes.push({ pct: newPct, x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 });
        selectedStepIndex = keyframes.length - 1;
        renderSteps();
        loadStepData();
        generateCode();
    });

    // Delete Step Button
    deleteStepBtn.addEventListener("click", () => {
        if (keyframes.length <= 2) return;
        keyframes.splice(selectedStepIndex, 1);
        selectedStepIndex = 0;
        renderSteps();
        loadStepData();
        generateCode();
    });

    // Copy Code Button
    const copyBtn = document.getElementById("copyCodeBtn");
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

    // --- RATING SYSTEM (Consistent with other files) ---
    const TOOL_KEY = "keyframe-generator-rating";
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
    
    // --- INIT ---
    renderSteps();
    loadStepData();
    generateCode();
});