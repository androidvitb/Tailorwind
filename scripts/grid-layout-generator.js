// Update Row Configuration ui
function updateRowConfig() {
    const rows = document.getElementById("rows").value;
    const columns = document.getElementById("columns").value;
    const rowConfigContainer = document.getElementById("row-config");

    // Clear existing configuration
    rowConfigContainer.innerHTML = '';

    // Create configuration inputs for each row
    for (let row = 1; row <= rows; row++) {
      const rowDiv = document.createElement("div");
      rowDiv.className = "collapsible bg-gray-100 rounded p-3 shadow";

      rowDiv.innerHTML = `
        <div class="flex justify-between items-center">
          <h3 class="text-sm font-medium text-gray-700">Row ${row} Configuration</h3>
          <button onclick="toggleRowConfig(this)" class="text-indigo-600 text-sm">Expand/Collapse</button>
        </div>
        <div class="content mt-3">
          <div class="grid grid-cols-${columns} gap-2">
            ${Array.from({ length: columns }, (_, col) => `
              <div>
                <label class="block text-xs text-gray-600">Item ${col + 1} (col-span):</label>
                <input type="number" value="1" min="1" max="${columns}"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  data-row="${row}" data-col="${col + 1}" onchange="storeSpan(this)"
                />
              </div>
            `).join('')}
          </div>
        </div>
      `;
      rowConfigContainer.appendChild(rowDiv);
    }
  }

  // Toggle Row Configuration Collapse
  function toggleRowConfig(button) {
    const collapsible = button.parentElement.parentElement;
    collapsible.classList.toggle("active");
  }

  // Store column span configurations
  const columnSpans = {};
  function storeSpan(input) {
    const row = input.getAttribute("data-row");
    const col = input.getAttribute("data-col");
    const span = input.value;

    if (!columnSpans[row]) columnSpans[row] = {};
    columnSpans[row][col] = span;
  }

  // Update generateGrid function to handle dark mode
  function generateGrid() {
    const rows = document.getElementById("rows").value;
    const columns = document.getElementById("columns").value;
    const container = document.getElementById("grid-container");
    const isDark = document.documentElement.classList.contains('dark');
    
    container.innerHTML = '';

    const gridClasses = `grid gap-4 p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border rounded shadow`;
    container.className = gridClasses;
    container.style.gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`;

    // Populate grid items with column spans
    for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= columns; col++) {
            const span = (columnSpans[row] && columnSpans[row][col]) || 1;
            const item = document.createElement("div");
            item.className = `bg-blue-500 text-white font-bold py-2 px-4 rounded text-center col-span-${span}`;
            item.innerText = `Row ${row} - Item ${col}`;
            container.appendChild(item);
        }
    }

    // Update code output for dark mode
    const outputCode = generateOutputCode(rows, columns, isDark);
    document.getElementById("output-code").innerText = outputCode.trim();
  }

  // New function to generate output code
  function generateOutputCode(rows, columns, isDark) {
    let outputCode = `<div class="grid gap-4 p-4 ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border rounded shadow">\n`;
    for (let row = 1; row <= rows; row++) {
        for (let col = 1; col <= columns; col++) {
            const span = (columnSpans[row] && columnSpans[row][col]) || 1;
            outputCode += `  <div class="col-span-${span} bg-blue-500 text-white font-bold py-2 px-4 rounded text-center">Row ${row} - Item ${col}</div>\n`;
        }
    }
    outputCode += `</div>`;
    return outputCode;
  }

  // Copy to Clipboard
  function copyToClipboard() {
    const code = document.getElementById("output-code").innerText;
    navigator.clipboard.writeText(code).then(() => {
      alert("Code copied to clipboard!");
    });
  }

  // Initialize default configuration
  updateRowConfig();
  generateGrid();

  // Initialize dark mode state
  document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark');
        generateGrid(); // Regenerate grid with dark mode styles
    }
  });
