// DOM Elements
const toastPreview = document.getElementById('toastPreview');
const toastIconContainer = document.getElementById('toastIconContainer');
const toastIcon = document.getElementById('toastIcon');
const toastMessage = document.getElementById('toastMessage');
const toastDescription = document.getElementById('toastDescription');
const toastCloseBtn = document.getElementById('toastCloseBtn');
const toastProgressBar = document.getElementById('toastProgressBar');

// Inputs
const toastType = document.getElementById('toastType');
const toastPosition = document.getElementById('toastPosition');
const toastAnimation = document.getElementById('toastAnimation');
const showIcon = document.getElementById('showIcon');
const showCloseBtn = document.getElementById('showCloseBtn');
const showProgressBar = document.getElementById('showProgressBar');
const inputTitle = document.getElementById('inputTitle');
const inputDesc = document.getElementById('inputDesc');

// Export Buttons
const exportCodeBtn = document.getElementById('exportCode');
const saveToastBtn = document.getElementById('saveToast');

// Configuration Maps
const typeStyles = {
    success: { bg: 'bg-green-100', text: 'text-green-500', icon: 'fa-check', bar: 'bg-green-500', darkBg: 'dark:bg-green-800', darkText: 'dark:text-green-200' },
    error:   { bg: 'bg-red-100',   text: 'text-red-500',   icon: 'fa-times', bar: 'bg-red-500',   darkBg: 'dark:bg-red-800',   darkText: 'dark:text-red-200' },
    warning: { bg: 'bg-yellow-100',text: 'text-yellow-500',icon: 'fa-exclamation', bar: 'bg-yellow-500', darkBg: 'dark:bg-yellow-800', darkText: 'dark:text-yellow-200' },
    info:    { bg: 'bg-blue-100',  text: 'text-blue-500',  icon: 'fa-info',  bar: 'bg-blue-500',  darkBg: 'dark:bg-blue-800',  darkText: 'dark:text-blue-200' },
    neutral: { bg: 'bg-gray-100',  text: 'text-gray-500',  icon: 'fa-bell',  bar: 'bg-gray-500',  darkBg: 'dark:bg-gray-700',  darkText: 'dark:text-gray-300' }
};

const positionStyles = {
    'top-left':      'top-4 left-4',
    'top-center':    'top-4 left-1/2 -translate-x-1/2',
    'top-right':     'top-4 right-4',
    'bottom-left':   'bottom-4 left-4',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
    'bottom-right':  'bottom-4 right-4'
};

// --- UPDATE LOGIC ---
function updateToast() {
    // 1. Update Content
    toastMessage.textContent = inputTitle.value;
    toastDescription.textContent = inputDesc.value;

    // 2. Update Type Colors
    const type = typeStyles[toastType.value];
    
    // Reset classes
    toastIconContainer.className = `inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${type.bg} ${type.text} ${type.darkBg} ${type.darkText}`;
    toastIcon.className = `fas ${type.icon}`;
    toastProgressBar.className = `absolute bottom-0 left-0 h-1 rounded-b-lg w-full ${type.bar}`;

    // 3. Update Position
    // Remove all positioning classes first
    toastPreview.classList.remove(...Object.values(positionStyles).join(' ').split(' '));
    // Add new position
    const posClass = positionStyles[toastPosition.value];
    // We split because "top-4 left-1/2 -translate-x-1/2" is multiple classes
    posClass.split(' ').forEach(cls => toastPreview.classList.add(cls));

    // 4. Update Animation
    toastPreview.classList.remove('animate-bounce', 'animate-pulse', 'animate-none');
    toastPreview.classList.add(toastAnimation.value);

    // 5. Toggles
    toastIconContainer.style.display = showIcon.checked ? 'inline-flex' : 'none';
    toastCloseBtn.style.display = showCloseBtn.checked ? 'inline-flex' : 'none';
    
    // Progress Bar Logic (Visual Only)
    if(showProgressBar.checked) {
        toastProgressBar.classList.remove('hidden');
        // 1. Remove transition temporarily so we can SNAP to 100% width instantly
        toastProgressBar.classList.remove('transition-all', 'duration-[3000ms]');
        toastProgressBar.style.width = '100%';

        // 2. Force a "Reflow" (Browsers are lazy, this forces it to paint the 100% width)
        // void toastProgressBar.offsetWidth;

        // 3. Add the transition back so the shrink is smooth
        toastProgressBar.classList.add('transition-all', 'duration-[2000ms]');
        
        // 4. Start shrinking to 0% almost immediately (small delay ensures browser catches up)
        setTimeout(() => {
            toastProgressBar.style.width = '0%';
        }, 50);

    } else {
        toastProgressBar.classList.add('hidden');
    }
}

// --- EVENT LISTENERS ---
[toastType, toastPosition, toastAnimation, showIcon, showCloseBtn, showProgressBar, inputTitle, inputDesc]
    .forEach(el => el.addEventListener('input', updateToast));


// --- EXPORT LOGIC ---
exportCodeBtn.addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    const uniqueId = `popup-${Date.now()}`;

    // IMPORTANT: For export, we change "absolute" to "fixed" so it sticks to the user's viewport
    let exportHTML = toastPreview.outerHTML
        .replace('absolute', 'fixed') // Fix position to viewport
        .replace('id="toastPreview"', '') // Remove ID to prevent conflicts
        .replace('style="width: 0%;"', 'style="width: 100%;"'); // Reset bar

    // Clean up empty style attributes
    exportHTML = exportHTML.replace('style=""', '');

    const popupClass = isDark ? 
        "fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50" :
        "fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50";

    const popup = document.createElement("div");
    popup.id = uniqueId;
    popup.className = popupClass;
    
    // Popup Content
    popup.innerHTML = `
      <div class="bg-${isDark ? 'gray-800' : 'white'} p-6 rounded-lg w-11/12 max-w-2xl shadow-lg relative mx-4">
        <button id="${uniqueId}-closeCross" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
        <h2 class="text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}">Get Your Code</h2>
        
        <div class="mb-4">
            <p class="text-sm text-gray-500 mb-2">HTML + Tailwind Classes:</p>
            <textarea id="${uniqueId}-codeArea" class="w-full h-48 font-mono text-sm ${isDark ? 'bg-gray-700 text-green-400' : 'bg-gray-100 text-gray-800'} p-4 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#049b9f]" readonly>${exportHTML}</textarea>
        </div>

        <div class="flex gap-3">
            <button id="${uniqueId}-copyButton" class="flex-1 bg-[#049b9f] hover:bg-[#037a7b] text-white px-4 py-2 rounded transition-colors font-medium">
                <i class="fas fa-copy mr-2"></i> Copy Code
            </button>
            <button id="${uniqueId}-closeButton" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition-colors">
                Close
            </button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);

    // Copy Functionality
    document.getElementById(`${uniqueId}-copyButton`).addEventListener("click", () => {
        const codeArea = document.getElementById(`${uniqueId}-codeArea`);
        codeArea.select();
        document.execCommand("copy");
        
        const btn = document.getElementById(`${uniqueId}-copyButton`);
        const originalText = btn.innerHTML;
        btn.innerHTML = `<i class="fas fa-check mr-2"></i> Copied!`;
        setTimeout(() => btn.innerHTML = originalText, 2000);
    });

    // Close Handlers
    const closePopup = () => document.body.removeChild(popup);
    document.getElementById(`${uniqueId}-closeCross`).addEventListener("click", closePopup);
    document.getElementById(`${uniqueId}-closeButton`).addEventListener("click", closePopup);
    popup.addEventListener("click", (e) => {
        if (e.target === popup) closePopup();
    });
});

// --- SAVE LOGIC ---
saveToastBtn.addEventListener('click', () => {
    const savedComponents = JSON.parse(localStorage.getItem("tailorwind-components")) || [];
    
    // We clean the HTML similar to export
    const cleanHTML = toastPreview.outerHTML.replace('absolute', 'fixed').replace('id="toastPreview"', '');

    savedComponents.push({
        id: Date.now(),
        type: "toast",
        code: cleanHTML,
        preview: cleanHTML // For dashboard preview
    });

    localStorage.setItem("tailorwind-components", JSON.stringify(savedComponents));
    alert("Toast component saved to dashboard!");
});

// --- RATING LOGIC (Copied from template) ---
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