// DOM elements
const advancedMode = document.getElementById("advancedMode");

// Advanced mode elements
const drinkCount = document.getElementById("drinkCount");
const sodaCount = document.getElementById("sodaCount");
const funCount = document.getElementById("funCount");
const bottleCount = document.getElementById("bottleCount");

// Cashier mode elements
const confirmButton = document.getElementById("confirmButton");
const cashierMode = document.getElementById("cashierMode");
const closeCashierButton = document.getElementById("closeCashierButton");
const cashierDrinkCount = document.getElementById("cashierDrinkCount");
const cashierSodaCount = document.getElementById("cashierSodaCount");
const cashierFunCount = document.getElementById("cashierFunCount");
const cashierBottleCount = document.getElementById("cashierBottleCount");

// Log view elements
const logToggle = document.getElementById("logToggle");
const logView = document.getElementById("logView");
const counterView = document.getElementById("counterView");
const drinkLog = document.getElementById("drinkLog");
const sodaLog = document.getElementById("sodaLog");
const funLog = document.getElementById("funLog");
const bottleLog = document.getElementById("bottleLog");

// Initialize counts and logs from localStorage or default to empty
let counts = {
  drink: parseInt(localStorage.getItem("drinkCount")) || 0,
  soda: parseInt(localStorage.getItem("sodaCount")) || 0,
  fun: parseInt(localStorage.getItem("funCount")) || 0,
  bottle: parseInt(localStorage.getItem("bottleCount")) || 0,
};

let logs = {
  drink: JSON.parse(localStorage.getItem("drinkLog")) || [],
  soda: JSON.parse(localStorage.getItem("sodaLog")) || [],
  fun: JSON.parse(localStorage.getItem("funLog")) || [],
  bottle: JSON.parse(localStorage.getItem("bottleLog")) || [],
};

// Header reset button
const headerResetButton = document.getElementById("headerResetButton");

// Initialize current mode from localStorage or default to advanced
let isAdvancedMode = true; // Always advanced mode now
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

  if (!drinkLog || !sodaLog || !funLog || !bottleLog) {
    console.error("Log elements not found");
    return;
  }

  // Clear existing content
  drinkLog.innerHTML = "";
  sodaLog.innerHTML = "";
  funLog.innerHTML = "";
  bottleLog.innerHTML = "";

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

  logs.bottle.forEach((time) => {
    const div = document.createElement("div");
    div.textContent = `Bottle ${time}`;
    bottleLog.appendChild(div);
  });

  console.log("Log display updated");
}

// Update cashier display
function updateCashierDisplay() {
  cashierDrinkCount.textContent = counts.drink;
  cashierSodaCount.textContent = counts.soda;
  cashierFunCount.textContent = counts.fun;
  cashierBottleCount.textContent = counts.bottle;
}

// Save logs to localStorage
function saveLogs() {
  try {
    localStorage.setItem("drinkLog", JSON.stringify(logs.drink));
    localStorage.setItem("sodaLog", JSON.stringify(logs.soda));
    localStorage.setItem("funLog", JSON.stringify(logs.fun));
    localStorage.setItem("bottleLog", JSON.stringify(logs.bottle));
    console.log("Logs saved:", logs);
    updateLogDisplay(); // Update display after saving
  } catch (error) {
    console.error("Error saving logs:", error);
  }
}

// Update all displays
function updateDisplays() {
  // Update advanced mode displays
  drinkCount.textContent = counts.drink;
  sodaCount.textContent = counts.soda;
  funCount.textContent = counts.fun;
  bottleCount.textContent = counts.bottle;

  // Update log display
  updateLogDisplay();
  
  // Update cashier display
  updateCashierDisplay();

  // Save all counts to localStorage
  localStorage.setItem("drinkCount", counts.drink.toString());
  localStorage.setItem("sodaCount", counts.soda.toString());
  localStorage.setItem("funCount", counts.fun.toString());
  localStorage.setItem("bottleCount", counts.bottle.toString());
}

// Update mode display
function updateModeDisplay() {
  // Always show advanced mode
  advancedMode.classList.add("active");
}

// Reset all counts and logs
function resetCounts() {
  counts = {
    drink: 0,
    soda: 0,
    fun: 0,
    bottle: 0,
  };
  logs = {
    drink: [],
    soda: [],
    fun: [],
    bottle: [],
  };
  updateDisplays();
  saveLogs();
}

// Header reset button event listener
headerResetButton.addEventListener("click", resetCounts);

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

// 4th category (bottle) event listeners
document.getElementById("addBottleButton").addEventListener("click", () => {
  const time = getCurrentTime();
  console.log("Adding bottle at:", time);
  counts.bottle++;
  logs.bottle.push(time);
  updateDisplays();
  saveLogs();
});

document.getElementById("subtractBottleButton").addEventListener("click", () => {
  if (counts.bottle > 0) {
    counts.bottle--;
    logs.bottle.pop();
    updateDisplays();
    saveLogs();
  }
});

// Cashier mode event listeners
confirmButton.addEventListener("click", () => {
  console.log("Opening cashier mode");
  cashierMode.classList.remove("hidden");
  counterView.classList.add("hidden");
  logView.classList.add("hidden");
});

closeCashierButton.addEventListener("click", () => {
  console.log("Closing cashier mode");
  cashierMode.classList.add("hidden");
  counterView.classList.remove("hidden");
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
