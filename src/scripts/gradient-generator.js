const directionEl = document.getElementById("direction");
const fromEl = document.getElementById("fromColor");
const viaEl = document.getElementById("viaColor");
const toEl = document.getElementById("toColor");

const preview = document.getElementById("gradientPreview");
const output = document.getElementById("gradientOutput");
const copyBtn = document.getElementById("copyGradient");

function updateGradient() {
  const dir = directionEl.value;
  const from = fromEl.value;
  const via = viaEl.value;
  const to = toEl.value;

  preview.style.background = `linear-gradient(${dir.replace("to-", "")}, ${from}, ${via}, ${to})`;

  output.textContent =
    `bg-gradient-${dir} from-[${from}] via-[${via}] to-[${to}]`;
}

[directionEl, fromEl, viaEl, toEl].forEach(el =>
  el.addEventListener("input", updateGradient)
);

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(output.textContent);
  copyBtn.textContent = "Copied!";
  setTimeout(() => copyBtn.textContent = "Copy Classes", 1500);
});

updateGradient();

/* Rating system (same pattern as color palette) */
const TOOL_KEY = "gradient-generator-rating";

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
