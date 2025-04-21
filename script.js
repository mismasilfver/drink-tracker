// DOM elements
const modeToggle = document.getElementById("modeToggle");
const simpleMode = document.getElementById("simpleMode");
const advancedMode = document.getElementById("advancedMode");

// Simple mode elements
const simpleDrinkCount = document.getElementById("simpleDrinkCount");
const simpleAddButton = document.getElementById("simpleAddButton");
const simpleSubtractButton = document.getElementById("simpleSubtractButton");
const simpleResetButton = document.getElementById("simpleResetButton");

// Advanced mode elements
const drinkCount = document.getElementById("drinkCount");
const sodaCount = document.getElementById("sodaCount");
const funCount = document.getElementById("funCount");

// Initialize counts from localStorage or default to 0
let counts = {
  drink: parseInt(localStorage.getItem("drinkCount")) || 0,
  soda: parseInt(localStorage.getItem("sodaCount")) || 0,
  fun: parseInt(localStorage.getItem("funCount")) || 0,
};

// Initialize current mode from localStorage or default to simple
let isAdvancedMode = localStorage.getItem("isAdvancedMode") === "true";
updateModeDisplay();

// Update all displays
function updateDisplays() {
  // Update simple mode display (shows only drink count)
  simpleDrinkCount.textContent = counts.drink;

  // Update advanced mode displays
  drinkCount.textContent = counts.drink;
  sodaCount.textContent = counts.soda;
  funCount.textContent = counts.fun;

  // Save all counts to localStorage
  localStorage.setItem("drinkCount", counts.drink.toString());
  localStorage.setItem("sodaCount", counts.soda.toString());
  localStorage.setItem("funCount", counts.fun.toString());
}

// Update mode display
function updateModeDisplay() {
  if (isAdvancedMode) {
    simpleMode.classList.remove("active");
    advancedMode.classList.add("active");
    modeToggle.style.transform = "rotate(180deg)";
  } else {
    simpleMode.classList.add("active");
    advancedMode.classList.remove("active");
    modeToggle.style.transform = "rotate(0deg)";
  }
  localStorage.setItem("isAdvancedMode", isAdvancedMode.toString());
}

// Reset all counts
function resetCounts() {
  counts = {
    drink: 0,
    soda: 0,
    fun: 0,
  };
  updateDisplays();
}

// Simple mode event listeners
simpleAddButton.addEventListener("click", () => {
  counts.drink++;
  updateDisplays();
});

simpleSubtractButton.addEventListener("click", () => {
  if (counts.drink > 0) {
    counts.drink--;
    updateDisplays();
  }
});

simpleResetButton.addEventListener("click", resetCounts);

// Advanced mode event listeners
document.getElementById("addDrinkButton").addEventListener("click", () => {
  counts.drink++;
  updateDisplays();
});

document.getElementById("subtractDrinkButton").addEventListener("click", () => {
  if (counts.drink > 0) {
    counts.drink--;
    updateDisplays();
  }
});

document.getElementById("addSodaButton").addEventListener("click", () => {
  counts.soda++;
  updateDisplays();
});

document.getElementById("subtractSodaButton").addEventListener("click", () => {
  if (counts.soda > 0) {
    counts.soda--;
    updateDisplays();
  }
});

document.getElementById("addFunButton").addEventListener("click", () => {
  counts.fun++;
  updateDisplays();
});

document.getElementById("subtractFunButton").addEventListener("click", () => {
  if (counts.fun > 0) {
    counts.fun--;
    updateDisplays();
  }
});

document
  .getElementById("advancedResetButton")
  .addEventListener("click", resetCounts);

// Mode toggle event listener
modeToggle.addEventListener("click", () => {
  isAdvancedMode = !isAdvancedMode;
  updateModeDisplay();
});

// Initial display update
updateDisplays();
