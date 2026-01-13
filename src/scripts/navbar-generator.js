function generateNavbar() {
    const navTitle = document.getElementById("navTitle").value;
    const navItems = document.getElementById("navItems").value.split(",");
    const navBgColor = document.getElementById("navBgColor").value;
    const navTextColor = document.getElementById("navTextColor").value;

    function generateNavbar() {
        const navTitle = document.getElementById("navTitle").value;
        const navItems = document.getElementById("navItems").value.split(",");
        const navBgColor = document.getElementById("navBgColor").value;
        const navTextColor = document.getElementById("navTextColor").value;
    
        // Generate navbar content
        const linksHtml = navItems
            .map(item => `<a href="#" style="color: ${navTextColor};">${item.trim()}</a>`)
            .join("");
    
        const navbarHtml = `
            <div style="display: flex; justify-content: space-between; align-items: center; background-color: ${navBgColor}; color: ${navTextColor}; padding: 10px;">
                <div>${navTitle}</div>
                <div style="display: flex; gap: 10px;">${linksHtml}</div>
            </div>
        `;
    
        // Update the preview
        document.getElementById("navbarPreview").innerHTML = navbarHtml;
    }
    
    // Attach the event listener
    document.getElementById("generateNavbar").addEventListener("click", generateNavbar);
    

    // Generate the links HTML
    const linksHtml = navItems.map(item => `<a href="#" class="text-sm px-3 py-2 hover:bg-gray-700 rounded transition duration-200" style="color: ${navTextColor};">${item}</a>`).join('');

    // Create the HTML for the navbar
    const generatedHtml = `
    <div class="w-full flex justify-between items-center p-4 ${getTailwindBgColor(navBgColor)} ${getTailwindTextColor(navTextColor)}">
        <div class="text-lg font-bold">${navTitle}</div>
        <div class="flex space-x-4">${linksHtml}</div>
    </div>
    `;

    // Create a new popup for the generated code
    createPopup(generatedHtml, navBgColor, navTextColor);
}

// Function to generate Tailwind background color
function getTailwindBgColor(color) {
    if (color.startsWith("#")) {
        return `bg-[${color}]`;
    }
    return "";
}

// Function to generate Tailwind text color
function getTailwindTextColor(color) {
    if (color.startsWith("#")) {
        return `text-[${color}]`;
    }
    return "";
}

// Function to create the popup
function createPopup(htmlCode, bgColor, textColor) {
    const popup = document.createElement("div");
    popup.className = "popup-container fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50";

    const popupContent = document.createElement("div");
    popupContent.className = "bg-white p-6 rounded-md w-3/4 max-w-lg relative";

    // Close button
    const closeButton = document.createElement("button");
    closeButton.innerHTML = "&times;";
    closeButton.className = "absolute top-2 right-2 text-xl text-gray-700";
    closeButton.onclick = () => popup.remove();  // Remove the popup when clicked

    // Copy button
    const copyButton = document.createElement("button");
    copyButton.innerText = "Copy Code";
    copyButton.className = "bg-blue-500 text-white py-2 px-4 rounded-md mt-4";
    copyButton.onclick = () => copyToClipboard(htmlCode); // Copy the code to clipboard

    // Textarea to display the generated code
    const codeTextArea = document.createElement("textarea");
    codeTextArea.value = htmlCode;
    codeTextArea.rows = 8;
    codeTextArea.cols = 60;
    codeTextArea.className = "w-full p-2 border border-gray-300 rounded-md mt-2";

    // Append elements to the popup
    popupContent.appendChild(closeButton);
    popupContent.appendChild(codeTextArea);
    popupContent.appendChild(copyButton);
    popup.appendChild(popupContent);

    // Append the popup to the body
    document.body.appendChild(popup);
}

// Function to copy code to clipboard
function copyToClipboard(code) {
    const textarea = document.createElement("textarea");
    textarea.value = code;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Code copied to clipboard!");
}

// Event listener for the "Generate Code" button
document.getElementById("generateNavbar").addEventListener("click", generateNavbar);
