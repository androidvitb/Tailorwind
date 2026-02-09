document.addEventListener("DOMContentLoaded", () => {
    
    // Elements
    const neuElement = document.getElementById("neuElement");
    const previewCanvas = document.getElementById("previewCanvas");
    const codeOutput = document.getElementById("codeOutput");
    const copyBtn = document.getElementById("copyBtn");
    
    // Light Dial
    const lightDial = document.getElementById("lightDial");
    const lightDot = document.getElementById("lightDot");
    const valAngle = document.getElementById("valAngle");

    // Inputs
    const inDistance = document.getElementById("inDistance");
    const inBlur = document.getElementById("inBlur");
    const inColor = document.getElementById("inColor");
    const hexDisplay = document.getElementById("hexDisplay");
    
    // Toggles
    const btnFlat = document.getElementById("btnFlat");
    const btnInset = document.getElementById("btnInset");
    
    // Labels
    const valDistance = document.getElementById("valDistance");
    const valBlur = document.getElementById("valBlur");

    // State
    let angle = 145; // Degrees
    let distance = 20;
    let blur = 60;
    let baseColor = "#e0e5ec";
    let isInset = false;

    // --- MATH HELPERS ---

    // Hex to RGB
    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    // Adjust Color (Lighten/Darken)
    function luminance(hex, lum) {
        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
            hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;

        // convert to decimal and change luminosity
        let rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
            c = parseInt(hex.substr(i*2,2), 16);
            c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
            rgb += ("00"+c).substr(c.length);
        }
        return rgb;
    }

    // --- CORE GENERATOR ---

    function updateNeumorphism() {
        // 1. Calculate Offsets based on Angle
        // Convert deg to radians
        const rad = angle * (Math.PI / 180);
        const x = Math.round(distance * Math.cos(rad));
        const y = Math.round(distance * Math.sin(rad));

        // 2. Calculate Shadow Colors
        // Light shadow = Lighter version of base
        // Dark shadow = Darker version of base
        const lightColor = luminance(baseColor, 0.15); // +15% brightness
        const darkColor = luminance(baseColor, -0.15); // -15% brightness

        // 3. Generate CSS String
        // Box Shadow format: [inset] x y blur color
        const insetPrefix = isInset ? "inset " : "";
        
        // Shadow 1 (Main Direction) - Usually the Dark one
        const shadow1 = `${insetPrefix}${x}px ${y}px ${blur}px ${darkColor}`;
        
        // Shadow 2 (Opposite Direction) - The Highlight
        const shadow2 = `${insetPrefix}${-x}px ${-y}px ${blur}px ${lightColor}`;
        
        const fullShadow = `${shadow1}, ${shadow2}`;

        // 4. Update DOM
        neuElement.style.boxShadow = fullShadow;
        neuElement.style.backgroundColor = baseColor;
        previewCanvas.style.backgroundColor = baseColor;
        
        // Update Dial Visual (Position the dot on the circle)
        // Dial radius is approx 48px (w-24 = 96px / 2)
        // We invert Y because CSS Y-axis is down, but unit circle Y is up
        const dialRad = 36; // Slightly inside the border
        const dotX = dialRad * Math.cos(rad);
        const dotY = dialRad * Math.sin(rad);
        lightDot.style.transform = `translate(calc(-50% + ${dotX}px), calc(-50% + ${dotY}px))`;

        // Update Labels
        valAngle.textContent = Math.round(angle);
        valDistance.textContent = `${distance}px`;
        valBlur.textContent = `${blur}px`;
        hexDisplay.value = baseColor;

        // 5. Generate Tailwind Arbitrary Value
        // Format: shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]
        const twShadow1 = `${insetPrefix}${x}px_${y}px_${blur}px_${darkColor}`;
        const twShadow2 = `${insetPrefix}${-x}px_${-y}px_${blur}px_${lightColor}`;
        
        // Replace spaces with underscores for Tailwind arbitrary syntax, but keep commas
        const twClass = `shadow-[${twShadow1},${twShadow2}]`.replace(/ /g, "_");
        
        codeOutput.textContent = twClass;
    }

    // --- EVENT LISTENERS ---

    // 1. Light Dial Interaction
    let isDragging = false;
    
    lightDial.addEventListener("mousedown", (e) => { isDragging = true; updateAngle(e); });
    document.addEventListener("mousemove", (e) => { if(isDragging) updateAngle(e); });
    document.addEventListener("mouseup", () => { isDragging = false; });

    function updateAngle(e) {
        // Calculate angle between center of dial and mouse cursor
        const rect = lightDial.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        // atan2 returns -PI to PI. We convert to Degrees.
        let deg = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
        if (deg < 0) deg += 360; // Normalize 0-360
        
        angle = deg;
        updateNeumorphism();
    }

    // 2. Inputs
    inDistance.addEventListener("input", (e) => { distance = e.target.value; updateNeumorphism(); });
    inBlur.addEventListener("input", (e) => { blur = e.target.value; updateNeumorphism(); });
    
    // Color Picker
    inColor.addEventListener("input", (e) => { baseColor = e.target.value; updateNeumorphism(); });
    hexDisplay.addEventListener("change", (e) => { 
        baseColor = e.target.value; 
        inColor.value = baseColor; // Sync picker
        updateNeumorphism(); 
    });

    // 3. Toggles
    btnFlat.addEventListener("click", () => {
        isInset = false;
        btnFlat.classList.add("bg-white", "shadow-sm", "font-medium", "text-gray-800");
        btnFlat.classList.remove("text-gray-500", "hover:bg-white/50");
        
        btnInset.classList.remove("bg-white", "shadow-sm", "font-medium", "text-gray-800");
        btnInset.classList.add("text-gray-500", "hover:bg-white/50");
        updateNeumorphism();
    });

    btnInset.addEventListener("click", () => {
        isInset = true;
        btnInset.classList.add("bg-white", "shadow-sm", "font-medium", "text-gray-800");
        btnInset.classList.remove("text-gray-500", "hover:bg-white/50");
        
        btnFlat.classList.remove("bg-white", "shadow-sm", "font-medium", "text-gray-800");
        btnFlat.classList.add("text-gray-500", "hover:bg-white/50");
        updateNeumorphism();
    });

    // Copy Button
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
    const TOOL_KEY = "neumorphism-generator-rating";
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
    updateNeumorphism();
});