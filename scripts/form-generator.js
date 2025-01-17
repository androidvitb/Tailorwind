document.addEventListener("DOMContentLoaded", () => {
  const formPreview = document.getElementById("formPreview");
  const codeDisplay = document.getElementById("codeDisplay");
  const exportedCode = document.getElementById("exportedCode");
  const fieldOptions = document.getElementById("fieldOptions");
  const buttonColorInput = document.getElementById("buttonColor");

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
