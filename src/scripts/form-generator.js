document.addEventListener("DOMContentLoaded", () => {
  const formPreview = document.getElementById("formPreview");
  const codeDisplay = document.getElementById("codeDisplay");
  const exportedCode = document.getElementById("exportedCode");
  const fieldOptions = document.getElementById("fieldOptions");
  const buttonColorInput = document.getElementById("buttonColor");

  // Check initial dark mode state
  const isDark = document.documentElement.classList.contains('dark');
  if (isDark) {
      updateFormPreview();
  }

  // Function to update form preview for dark mode
  function updateFormPreview() {
      const inputs = formPreview.querySelectorAll('input, textarea');
      const isDark = document.documentElement.classList.contains('dark');
      
      inputs.forEach(input => {
          if (isDark) {
              input.style.backgroundColor = '#404040';
              input.style.borderColor = '#555';
              input.style.color = 'white';
          } else {
              input.style.backgroundColor = '';
              input.style.borderColor = '';
              input.style.color = '';
          }
      });
  }

  // Observer for dark mode changes
  const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
          if (mutation.attributeName === 'class') {
              updateFormPreview();
          }
      });
  });

  observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
  });

  // Add new field group dynamically
  document.getElementById("addFieldGroup").addEventListener("click", () => {
    const fieldGroup = document.createElement("div");
    fieldGroup.className = "field-group space-y-4 mt-4";

    fieldGroup.innerHTML = `
        <label class="block mb-2">
          <span class="font-medium">Field Label:</span>
          <input type="text" class="field-label border border-gray-300 p-2 rounded w-full" placeholder="Enter field label" />
        </label>
        <label class="block mb-2">
          <span class="font-medium">Placeholder Text:</span>
          <input type="text" class="field-placeholder border border-gray-300 p-2 rounded w-full" placeholder="Enter placeholder text" />
        </label>
        <label class="block mb-2">
          <span class="font-medium">Field Type:</span>
          <select class="field-type border border-gray-300 p-2 rounded w-full">
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="password">Password</option>
            <option value="number">Number</option>
            <option value="textarea">Textarea</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
            <option value="date">Date</option>
            <option value="color">Color Picker</option>
          </select>
        </label>
        <button type="button" class="remove-field bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Remove Field
        </button>
      `;

    fieldOptions.appendChild(fieldGroup);

    // Add event listener to the remove button
    fieldGroup.querySelector(".remove-field").addEventListener("click", () => {
      fieldOptions.removeChild(fieldGroup);
    });
  });

  // Add fields to form preview
  document.getElementById("addField").addEventListener("click", () => {
    const numFieldsInRow =
      parseInt(document.getElementById("numFieldsInRow").value, 10) || 1;
    const rowContainer = document.createElement("div");
    rowContainer.className = `grid grid-cols-${Math.min(
      numFieldsInRow,
      4
    )} gap-4`;

    const fieldGroups = fieldOptions.querySelectorAll(".field-group");
    fieldGroups.forEach((group) => {
      const fieldLabel = group.querySelector(".field-label").value || "Label";
      const placeholderText =
        group.querySelector(".field-placeholder").value || "";
      const fieldType = group.querySelector(".field-type").value || "text";

      const fieldContainer = document.createElement("div");
      fieldContainer.className = "flex flex-col";

      const label = document.createElement("label");
      label.className = "font-medium mb-1";
      label.innerText = fieldLabel;

      let fieldElement;
      if (fieldType === "textarea") {
        fieldElement = document.createElement("textarea");
        fieldElement.rows = 3;
        fieldElement.placeholder = placeholderText;
      } else if (fieldType === "checkbox" || fieldType === "radio") {
        fieldElement = document.createElement("input");
        fieldElement.type = fieldType;
      } else {
        fieldElement = document.createElement("input");
        fieldElement.type = fieldType;
        fieldElement.placeholder = placeholderText;
      }

      fieldElement.className = "border border-gray-300 p-2 rounded";
      fieldContainer.appendChild(label);
      fieldContainer.appendChild(fieldElement);
      rowContainer.appendChild(fieldContainer);
    });

    formPreview.appendChild(rowContainer);
  });

  // Add button to form preview
  document.getElementById("addButton").addEventListener("click", () => {
    const buttonText = document.getElementById("buttonText").value || "Submit";
    const buttonColor = buttonColorInput.value || "#0000ff";

    const button = document.createElement("button");
    button.textContent = buttonText;
    button.style.backgroundColor = buttonColor;
    button.className = "text-white px-4 py-2 rounded";
    formPreview.appendChild(button);
  });

  // Export form HTML
  document.getElementById("exportForm").addEventListener("click", () => {
    exportedCode.textContent = formPreview.innerHTML;
    codeDisplay.classList.remove("hidden");
  });
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



