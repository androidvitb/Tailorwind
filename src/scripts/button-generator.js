document.addEventListener("DOMContentLoaded", () => {

    const previewArea = document.getElementById("previewArea");
    const codeBox = document.getElementById("codeBox");
    const generatedCode = document.getElementById("generatedCode");

    // Standard Inputs
    const textInput = document.getElementById("btnText");
    const colorInput = document.getElementById("btnColor");
    const textColorInput = document.getElementById("textColor");
    const sizeInput = document.getElementById("btnSize");
    const shapeInput = document.getElementById("btnShape");
    const hoverInput = document.getElementById("btnHover");
    const outlineInput = document.getElementById("btnOutline");
    const shadowInput = document.getElementById("btnShadow");
    const widthInput = document.getElementById("btnWidth");
    const iconInput = document.getElementById("btnIcon");
    const iconPosInput = document.getElementById("iconPosition");
    const animationInput = document.getElementById("btnAnimation");

    // Advanced Inputs
    const useGradientInput = document.getElementById("useGradient");
    const gradientStartInput = document.getElementById("gradientStart");
    const gradientEndInput = document.getElementById("gradientEnd");
    const gradientDirInput = document.getElementById("gradientDir");
    const glassInput = document.getElementById("btnGlass");
    const effect3DInput = document.getElementById("btn3D");

    // NEW: Glass Customization Inputs
    const glassOpacityInput = document.getElementById("glassOpacity");
    const glassBlurInput = document.getElementById("glassBlur");
    const glassOpacityVal = document.getElementById("glassOpacityVal");
    const glassBlurVal = document.getElementById("glassBlurVal");

    // Configuration Maps
    const shapeMap = {
        rounded: "rounded",
        "rounded-lg": "rounded-lg",
        pill: "rounded-full",
        capsule: "rounded-full px-8",
        square: "",
        circle: "rounded-full aspect-square h-14 w-14 flex items-center justify-center",
        diamond: "diamond-shape",
        slanted: "slanted-shape",
        cut: "cut-corners",
        blob: "blob-shape",
        leaf: "leaf-shape",
        hex: "hexagon-shape"
    };

    const hoverMap = {
        lift: "lift",
        scale: "scale",
        darken: "darken",
        lighten: "lighten",
        glow: "glow",
        rotate: "rotate",
        skew: "skew",
        borderGrow: "borderGrow"
    };

    // --- HELPER: Hex to RGB ---
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 255, g: 255, b: 255 };
    }

    // --- HELPER: Darken/Lighten Hex Color for 3D Shadow ---
    function adjustBrightness(col, amt) {
        let usePound = false;
        if (col[0] == "#") {
            col = col.slice(1);
            usePound = true;
        }
        let num = parseInt(col, 16);
        let r = (num >> 16) + amt;
        if (r > 255) r = 255; else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amt;
        if (b > 255) b = 255; else if (b < 0) b = 0;
        let g = (num & 0x0000FF) + amt;
        if (g > 255) g = 255; else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16);
    }

    // --- MAIN GENERATION FUNCTION ---
    const updatePreview = () => {
        const text = textInput.value || "Click Me";
        const bg = colorInput.value;
        const txt = textColorInput.value;
        const size = sizeInput.value;
        const shapeCls = shapeMap[shapeInput.value] || "";
        const hoverCls = hoverMap[hoverInput.value] || "";
        const shadowCls = shadowInput.value;
        const widthCls = widthInput.value;
        const animationCls = animationInput.value;

        const icon = iconInput.value.trim();
        const iconPos = iconPosInput.value;

        // Features
        const useGradient = useGradientInput.checked;
        const gradStart = gradientStartInput.value;
        const gradEnd = gradientEndInput.value;
        const gradDir = gradientDirInput.value;
        const isGlass = glassInput.checked;
        const is3D = effect3DInput.checked;

        // Toggle Gradient Controls
        const gradBox = document.getElementById("gradientControls");
        gradBox.classList.toggle("hidden", !useGradient);

        // Toggle Glass Controls
        const glassBox = document.getElementById("glassControls");
        glassBox.classList.toggle("hidden", !isGlass);

        // Update Slider Labels
        glassOpacityVal.textContent = glassOpacityInput.value;
        glassBlurVal.textContent = glassBlurInput.value + "px";

        // --- CONTENT LOGIC ---
        const textMarkup = `<span class="btn-text">${text}</span>`;
        const iconMarkup = icon ? `<i class="${icon} btn-icon"></i>` : "";
        let content = "";
        if (icon) {
            content = iconPos === "left" 
                ? `${iconMarkup} <span class="w-2 inline-block"></span> ${textMarkup}` 
                : `${textMarkup} <span class="w-2 inline-block"></span> ${iconMarkup}`;
        } else {
            content = textMarkup;
        }

        // --- STYLE LOGIC ---
        let style = "";
        let finalClasses = [size, shapeCls, hoverCls, shadowCls, widthCls, animationCls];

        if (outlineInput.checked) {
            style = `border:2px solid ${bg}; color:${bg}; background:transparent;`;
        } else {
            // Background Logic
            if (isGlass) {
                finalClasses.push("glass");
                
                // Calculate RGBA for Glass Tint
                // We use the "Background Color" input as the tint color
                const rgb = hexToRgb(bg);
                const opacity = glassOpacityInput.value;
                const blurAmount = glassBlurInput.value;

                style = `background: rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity}); 
                         backdrop-filter: blur(${blurAmount}px); 
                         -webkit-backdrop-filter: blur(${blurAmount}px); 
                         color:${txt};`;

            } else if (useGradient) {
                style = `background: linear-gradient(${gradDir}, ${gradStart}, ${gradEnd}); color:${txt};`;
            } else {
                style = `background:${bg}; color:${txt};`;
            }

            // 3D Press Logic
            if (is3D && !outlineInput.checked && !isGlass) {
                finalClasses.push("btn-3d");
                const baseColor = useGradient ? gradEnd : bg;
                const shadowColor = adjustBrightness(baseColor, -60);
                style += ` box-shadow: 0 4px 0 ${shadowColor}; margin-bottom: 4px;`;
            }
        }

        const btnHTML = `
<button class="inline-flex items-center justify-center transition-all duration-300 
${finalClasses.join(" ")}" style="${style.replace(/\n/g, '')}">
    ${content}
</button>`.trim();

        previewArea.innerHTML = btnHTML;
        generatedCode.textContent = btnHTML;
    };

    // --- EVENT LISTENERS ---
    const allInputs = [
        textInput, colorInput, textColorInput, sizeInput, shapeInput, 
        hoverInput, outlineInput, shadowInput, widthInput, 
        iconInput, iconPosInput, animationInput,
        useGradientInput, gradientStartInput, gradientEndInput, 
        gradientDirInput, glassInput, effect3DInput,
        glassOpacityInput, glassBlurInput // Added listener for new sliders
    ];

    allInputs.forEach(input => {
        if(input) {
            input.addEventListener('input', updatePreview);
            input.addEventListener('change', updatePreview);
        }
    });

    document.getElementById("generateBtn").addEventListener("click", updatePreview);

    document.getElementById("showCode").addEventListener("click", () => {
        codeBox.classList.remove("hidden");
    });
    document.getElementById("closeCode").addEventListener("click", () => {
        codeBox.classList.add("hidden");
    });
    document.getElementById("copyCode").addEventListener("click", () => {
        navigator.clipboard.writeText(generatedCode.textContent);
        const copyBtn = document.getElementById("copyCode");
        const originalText = copyBtn.innerText;
        copyBtn.innerText = "Copied!";
        copyBtn.classList.remove("bg-blue-500");
        copyBtn.classList.add("bg-green-500");
        setTimeout(() => {
            copyBtn.innerText = originalText;
            copyBtn.classList.add("bg-blue-500");
            copyBtn.classList.remove("bg-green-500");
        }, 2000);
    });

    updatePreview();
});