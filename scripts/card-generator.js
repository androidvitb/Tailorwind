const card = document.getElementById("card");
const cardWidth = document.getElementById("cardWidth");
const roundedCorners = document.getElementById("roundedCorners");
const useImage = document.getElementById("useImage");
const useFooter = document.getElementById("useFooter");
const centerText = document.getElementById("centerText");

const cardBackground = document.getElementById("cardBackground");
const cardTitleColor = document.getElementById("cardTitleColor");
const cardContentColor = document.getElementById("cardContentColor");

const buttonTextColor = document.getElementById("buttonTextColor");
const buttonBackgroundColor = document.getElementById("buttonBackgroundColor");

const cardTitle = document.getElementById("cardTitle");
const cardContent = document.getElementById("cardContent");
const cardButton = document.getElementById("cardButton");
const cardFooter = document.getElementById("cardFooter");
const cardTitleInput = document.getElementById("cardTitleInput");
const cardContentInput = document.getElementById("cardContentInput");
const cardButtonInput = document.getElementById("cardButtonInput");
const cardFooterInput = document.getElementById("cardFooterInput");
const cardImage = document.getElementById("cardImage");
const exportCodeButton = document.getElementById("exportCode");

cardWidth.addEventListener("input", () => {
  card.style.width = `${cardWidth.value}px`;
});

roundedCorners.addEventListener("change", () => {
  card.classList.toggle("rounded-lg", roundedCorners.checked);
});

useImage.addEventListener("change", () => {
  cardImage.style.display = useImage.checked ? "block" : "none";
});

useFooter.addEventListener("change", () => {
  cardFooter.style.display = useFooter.checked ? "block" : "none";
});

centerText.addEventListener("change", () => {
  card.classList.toggle("text-center", centerText.checked);
});

cardBackground.addEventListener("input", () => {
  card.style.backgroundColor = cardBackground.value;
});

cardTitleColor.addEventListener("input", () => {
  cardTitle.style.color = cardTitleColor.value;
});

cardContentColor.addEventListener("input", () => {
  cardContent.style.color = cardContentColor.value;
});

buttonTextColor.addEventListener("input", () => {
  cardButton.style.color = buttonTextColor.value;
});

buttonBackgroundColor.addEventListener("input", () => {
  cardButton.style.backgroundColor = buttonBackgroundColor.value;
});
cardTitle.innerHTML = cardTitleInput.value;
cardContent.innerHTML = cardContentInput.value;
cardButton.innerHTML = cardButtonInput.value;
cardFooter.innerHTML = cardFooterInput.value;
cardTitleInput.addEventListener("input", () => {
  cardTitle.innerHTML = cardTitleInput.value;
});

cardContentInput.addEventListener("input", () => {
  cardContent.innerHTML = cardContentInput.value;
});

cardButtonInput.addEventListener("input", () => {
  cardButton.innerHTML = cardButtonInput.value;
});

cardFooterInput.addEventListener("input", () => {
  cardFooter.innerHTML = cardFooterInput.value;
});
exportCodeButton.addEventListener("click", () => {
  const uniqueId = `popup-${Date.now()}`; 

  const cardHTML = `
    <div class="p-4 bg-[${cardBackground.value}] ${
    roundedCorners.checked ? "rounded-lg" : ""
  } ${centerText.checked ? "text-center" : ""} shadow max-w-[${
    cardWidth.value
  }px]">
      ${
        useImage.checked
          ? `<div class="bg-gray-800 w-full h-32 rounded-t-lg flex items-center justify-center">
        <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></div>
      </div>`
          : ""
      }
      <h3 class="mt-4 text-xl font-bold text-[${cardTitleColor.value}]">${
    cardTitle.innerHTML
  }</h3>
      <p class="mt-2 text-[${cardContentColor.value}]">${
    cardContent.innerHTML
  }</p>
      <button class="mt-4 bg-[${buttonBackgroundColor.value}] text-[${
    buttonTextColor.value
  }] px-4 py-2 rounded w-full">${cardButton.innerHTML}</button>
      ${
        useFooter.checked
          ? `<div class="mt-4 text-gray-500 text-sm">${cardFooter.innerText}</div>`
          : ""
      }
    </div>
  `;

  const popup = document.createElement("div");
  popup.id = uniqueId; 
  popup.className =
    "fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50";
  popup.innerHTML = `
    <div class="bg-white p-6 rounded-lg w-4/5 max-w-screen-lg shadow-lg my-5 relative" id="${uniqueId}-container">
      <button id="${uniqueId}-closeCross" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold">×</button>
      <h2 class="text-lg font-bold mb-4">Copy the Code</h2>
      <textarea id="${uniqueId}-codeArea" class="w-full h-48 bg-gray-100 p-2 rounded border border-gray-300" readonly>${cardHTML}</textarea>
      <button id="${uniqueId}-copyButton" class="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full">Copy to Clipboard</button>
      <button id="${uniqueId}-closeButton" class="mt-2 bg-slate-600 text-white px-4 py-2 rounded w-full">Close</button>
    </div>
  `;

  document.body.appendChild(popup);

  const popupContainer = document.getElementById(`${uniqueId}-container`);
  popupContainer.scrollIntoView({ behavior: "smooth", block: "center" });

  document.getElementById(`${uniqueId}-copyButton`).addEventListener("click", () => {
    const codeArea = document.getElementById(`${uniqueId}-codeArea`);
    codeArea.select();
    document.execCommand("copy");
  });

  document.getElementById(`${uniqueId}-closeCross`).addEventListener("click", (event) => {
    const popupToRemove = event.target.closest(`#${uniqueId}`);
    document.body.removeChild(popupToRemove);
  });

  document.getElementById(`${uniqueId}-closeButton`).addEventListener("click", (event) => {
    const popupToRemove = event.target.closest(`#${uniqueId}`);
    document.body.removeChild(popupToRemove);
  });
});
