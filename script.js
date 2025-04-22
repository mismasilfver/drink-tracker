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

// Log view elements
const logToggle = document.getElementById("logToggle");
const logView = document.getElementById("logView");
const counterView = document.getElementById("counterView");
const drinkLog = document.getElementById("drinkLog");
const sodaLog = document.getElementById("sodaLog");
const funLog = document.getElementById("funLog");

// Initialize counts and logs from localStorage or default to empty
let counts = {
  drink: parseInt(localStorage.getItem("drinkCount")) || 0,
  soda: parseInt(localStorage.getItem("sodaCount")) || 0,
  fun: parseInt(localStorage.getItem("funCount")) || 0,
};

let logs = {
  drink: JSON.parse(localStorage.getItem("drinkLog")) || [],
  soda: JSON.parse(localStorage.getItem("sodaLog")) || [],
  fun: JSON.parse(localStorage.getItem("funLog")) || [],
};

// Initialize current mode from localStorage or default to simple
let isAdvancedMode = localStorage.getItem("isAdvancedMode") === "true";
updateModeDisplay();

// Get current time in HH:mm format
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Update log display
function updateLogDisplay() {
  console.log("Updating log display");
  console.log("Current logs:", logs);

  if (!drinkLog || !sodaLog || !funLog) {
    console.error("Log elements not found");
    return;
  }

  // Clear existing content
  drinkLog.innerHTML = "";
  sodaLog.innerHTML = "";
  funLog.innerHTML = "";

  // Add new entries
  logs.drink.forEach((time) => {
    const div = document.createElement("div");
    div.textContent = `Drink ${time}`;
    drinkLog.appendChild(div);
  });

  logs.soda.forEach((time) => {
    const div = document.createElement("div");
    div.textContent = `Soda ${time}`;
    sodaLog.appendChild(div);
  });

  logs.fun.forEach((time) => {
    const div = document.createElement("div");
    div.textContent = `Fun ${time}`;
    funLog.appendChild(div);
  });

  console.log("Log display updated");
}

// Save logs to localStorage
function saveLogs() {
  try {
    localStorage.setItem("drinkLog", JSON.stringify(logs.drink));
    localStorage.setItem("sodaLog", JSON.stringify(logs.soda));
    localStorage.setItem("funLog", JSON.stringify(logs.fun));
    console.log("Logs saved:", logs);
    updateLogDisplay(); // Update display after saving
  } catch (error) {
    console.error("Error saving logs:", error);
  }
}

// Update all displays
function updateDisplays() {
  // Update simple mode display (shows only drink count)
  simpleDrinkCount.textContent = counts.drink;

  // Update advanced mode displays
  drinkCount.textContent = counts.drink;
  sodaCount.textContent = counts.soda;
  funCount.textContent = counts.fun;

  // Update log display
  updateLogDisplay();

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
  } else {
    simpleMode.classList.add("active");
    advancedMode.classList.remove("active");
  }
  localStorage.setItem("isAdvancedMode", isAdvancedMode.toString());
}

// Reset all counts and logs
function resetCounts() {
  counts = {
    drink: 0,
    soda: 0,
    fun: 0,
  };
  logs = {
    drink: [],
    soda: [],
    fun: [],
  };
  updateDisplays();
  saveLogs();
}

// Simple mode event listeners
simpleAddButton.addEventListener("click", () => {
  const time = getCurrentTime();
  console.log("Adding drink at:", time);
  counts.drink++;
  logs.drink.push(time);
  updateDisplays();
  saveLogs();
});

simpleSubtractButton.addEventListener("click", () => {
  if (counts.drink > 0) {
    counts.drink--;
    logs.drink.pop();
    updateDisplays();
    saveLogs();
  }
});

simpleResetButton.addEventListener("click", resetCounts);

// Advanced mode event listeners
document.getElementById("addDrinkButton").addEventListener("click", () => {
  const time = getCurrentTime();
  console.log("Adding drink at:", time);
  counts.drink++;
  logs.drink.push(time);
  updateDisplays();
  saveLogs();
});

document.getElementById("subtractDrinkButton").addEventListener("click", () => {
  if (counts.drink > 0) {
    counts.drink--;
    logs.drink.pop();
    updateDisplays();
    saveLogs();
  }
});

document.getElementById("addSodaButton").addEventListener("click", () => {
  const time = getCurrentTime();
  console.log("Adding soda at:", time);
  counts.soda++;
  logs.soda.push(time);
  updateDisplays();
  saveLogs();
});

document.getElementById("subtractSodaButton").addEventListener("click", () => {
  if (counts.soda > 0) {
    counts.soda--;
    logs.soda.pop();
    updateDisplays();
    saveLogs();
  }
});

document.getElementById("addFunButton").addEventListener("click", () => {
  const time = getCurrentTime();
  console.log("Adding fun at:", time);
  counts.fun++;
  logs.fun.push(time);
  updateDisplays();
  saveLogs();
});

document.getElementById("subtractFunButton").addEventListener("click", () => {
  if (counts.fun > 0) {
    counts.fun--;
    logs.fun.pop();
    updateDisplays();
    saveLogs();
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

// Log view functionality
logToggle.addEventListener("click", () => {
  console.log("Toggling log view");
  console.log("Current logs:", logs);

  logView.classList.toggle("hidden");
  counterView.classList.toggle("hidden");

  if (!logView.classList.contains("hidden")) {
    console.log("Log view is now visible");
    updateLogDisplay(); // Force update when showing log view
  }
});

// Initialize displays
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing displays");
  updateModeDisplay();
  updateDisplays();
  console.log("Initialization complete");
});
