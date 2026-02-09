// --- STATE MANAGEMENT ---
let blocks = [];
let selectedId = null;
let globalAnimation = 'animate-pulse';

// --- DOM ELEMENTS ---
const previewContainer = document.getElementById('previewContainer');
const emptyState = document.getElementById('emptyState');
const propertiesPanel = document.getElementById('propertiesPanel');
const noSelectionMsg = document.getElementById('noSelectionMsg');

// Inputs
const propWidth = document.getElementById('propWidth');
const propHeight = document.getElementById('propHeight');
const propRadius = document.getElementById('propRadius');
const propWidthVal = document.getElementById('propWidthVal');
const propHeightVal = document.getElementById('propHeightVal');
const selectedTypeSpan = document.getElementById('selectedType');

// --- INITIAL DEFAULTS ---
const defaults = {
    text:   { width: 100, height: 1,   radius: 'rounded' },
    title:  { width: 60,  height: 2,   radius: 'rounded-md' },
    avatar: { width: 15,  height: 3.5, radius: 'rounded-full' }, // Approx 3.5rem = 56px
    image:  { width: 100, height: 12,  radius: 'rounded-lg' }
};

// --- CORE FUNCTIONS ---

// 1. Add Block
window.addBlock = (type) => {
    const id = Date.now();
    const config = defaults[type];
    
    blocks.push({
        id,
        type,
        width: config.width, // percentage
        height: config.height, // rem
        radius: config.radius
    });
    
    // Select the new block immediately
    selectedId = id;
    render();
};

// 2. Render Canvas
function render() {
    // Clear container but keep empty state if needed
    previewContainer.innerHTML = '';
    
    if (blocks.length === 0) {
        previewContainer.appendChild(emptyState);
        emptyState.style.display = 'block';
        propertiesPanel.classList.add('hidden');
        noSelectionMsg.classList.remove('hidden');
        return;
    }

    emptyState.style.display = 'none';

    blocks.forEach(block => {
        const el = document.createElement('div');
        
        // Base Styling
        el.className = `dark:bg-gray-700 mb-4 ${block.radius} ${globalAnimation}`;
        if(globalAnimation === 'animate-shimmer') el.classList.remove('bg-gray-200', 'dark:bg-gray-700'); // Shimmer handles its own bg
        
        // Dimensions
        el.style.width = `${block.width}%`;
        el.style.height = `${block.height}rem`;
        
        // Selection Interaction
        el.classList.add('hover-block');
        if (block.id === selectedId) {
            el.classList.add('selected-block');
        }
        
        el.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent clicking container deselecting
            selectedId = block.id;
            render();
        });

        previewContainer.appendChild(el);
    });

    updatePropertiesPanel();
}

// 3. Update Properties Side Panel
function updatePropertiesPanel() {
    if (!selectedId) {
        propertiesPanel.classList.add('hidden');
        noSelectionMsg.classList.remove('hidden');
        return;
    }

    const block = blocks.find(b => b.id === selectedId);
    if (!block) return;

    propertiesPanel.classList.remove('hidden');
    noSelectionMsg.classList.add('hidden');

    // Update Input Values
    selectedTypeSpan.textContent = block.type.charAt(0).toUpperCase() + block.type.slice(1);
    propWidth.value = block.width;
    propWidthVal.textContent = block.width + '%';
    propHeight.value = block.height;
    propHeightVal.textContent = block.height + 'rem';
    propRadius.value = block.radius;
}

// --- EVENT LISTENERS ---

// Animation Toggle
document.getElementById('globalAnimation').addEventListener('change', (e) => {
    globalAnimation = e.target.value;
    render();
});

// Property Inputs
const updateSelected = () => {
    if (!selectedId) return;
    const block = blocks.find(b => b.id === selectedId);
    block.width = propWidth.value;
    block.height = propHeight.value;
    block.radius = propRadius.value;
    render();
};

propWidth.addEventListener('input', updateSelected);
propHeight.addEventListener('input', updateSelected);
propRadius.addEventListener('change', updateSelected);

// Delete Block
document.getElementById('deleteBlock').addEventListener('click', () => {
    blocks = blocks.filter(b => b.id !== selectedId);
    selectedId = null;
    render();
});

// Duplicate Block
document.getElementById('duplicateBlock').addEventListener('click', () => {
    const original = blocks.find(b => b.id === selectedId);
    const newBlock = { ...original, id: Date.now() };
    blocks.push(newBlock);
    selectedId = newBlock.id;
    render();
});

// Reset Canvas
document.getElementById('resetCanvas').addEventListener('click', () => {
    if(confirm("Clear all elements?")) {
        blocks = [];
        selectedId = null;
        render();
    }
});

// Deselect when clicking empty area
previewContainer.addEventListener('click', (e) => {
    if(e.target === previewContainer) {
        selectedId = null;
        render();
    }
});

// --- EXPORT LOGIC ---
document.getElementById('exportCode').addEventListener('click', () => {
    const isDark = document.documentElement.classList.contains('dark');
    const uniqueId = `popup-${Date.now()}`;
    
    // Generate HTML String
    let code = `<div role="status" class="w-full max-w-lg p-4 space-y-4 border border-gray-200 divide-y divide-gray-200 rounded shadow animate-pulse dark:divide-gray-700 md:p-6 dark:border-gray-700">\n`;
    
    // If shimmer, we use a different wrapper class
    if (globalAnimation === 'animate-shimmer') {
        code = `<div role="status" class="w-full max-w-lg space-y-4">\n`;
    } else if (globalAnimation === 'none') {
        code = `<div role="status" class="w-full max-w-lg space-y-4">\n`;
    }

    blocks.forEach(b => {
        let classes = `bg-gray-200 dark:bg-gray-700 ${b.radius}`;
        if (globalAnimation === 'animate-shimmer') classes = `h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4 animate-shimmer`; 
        
        // We calculate height class or inline style
        // For simplicity in export, we use inline style for custom dimensions to ensure accuracy
        let style = `width: ${b.width}%; height: ${b.height}rem;`;
        
        if (globalAnimation === 'animate-shimmer') {
             // For shimmer export, we need the specific class we added in CSS
             // Since shimmer is custom CSS, we export the style block or just the classes if user has them
             // To be safe for Tailwind users, we'll stick to 'animate-pulse' in export unless they have the custom class
             code += `  <div class="bg-gray-200 dark:bg-gray-700 ${b.radius} ${globalAnimation}" style="${style}"></div>\n`;
        } else {
             code += `  <div class="bg-gray-200 dark:bg-gray-700 ${b.radius}" style="${style}"></div>\n`;
        }
    });

    code += `  <span class="sr-only">Loading...</span>\n</div>`;

    // Note for user about animation
    if (globalAnimation === 'animate-shimmer') {
        code = `\n\n\n` + code;
    }

    // Reuse the Popup Logic from Toast Generator
    const popupClass = isDark ? 
        "fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50" :
        "fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50";

    const popup = document.createElement("div");
    popup.id = uniqueId;
    popup.className = popupClass;
    
    popup.innerHTML = `
      <div class="bg-${isDark ? 'gray-800' : 'white'} p-6 rounded-lg w-11/12 max-w-2xl shadow-lg relative mx-4">
        <button id="${uniqueId}-closeCross" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
        <h2 class="text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-800'}">Get Your Code</h2>
        <textarea id="${uniqueId}-codeArea" class="w-full h-48 font-mono text-sm ${isDark ? 'bg-gray-700 text-green-400' : 'bg-gray-100 text-gray-800'} p-4 rounded border border-gray-300 focus:outline-none" readonly>${code}</textarea>
        <div class="flex gap-3 mt-4">
            <button id="${uniqueId}-copyButton" class="flex-1 bg-[#049b9f] hover:bg-[#037a7b] text-white px-4 py-2 rounded font-medium">Copy Code</button>
            <button id="${uniqueId}-closeButton" class="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>
    `;

    document.body.appendChild(popup);
    
    document.getElementById(`${uniqueId}-copyButton`).addEventListener("click", () => {
        document.getElementById(`${uniqueId}-codeArea`).select();
        document.execCommand("copy");
        alert("Copied!");
    });
    
    const close = () => document.body.removeChild(popup);
    document.getElementById(`${uniqueId}-closeCross`).addEventListener("click", close);
    document.getElementById(`${uniqueId}-closeButton`).addEventListener("click", close);
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