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

// BAC panel elements
const bacValue = document.getElementById("bacValue");
const bacSober = document.getElementById("bacSober");
const bacNote = document.getElementById("bacNote");

// Physical data elements
const physicalDataToggle = document.getElementById("physicalDataToggle");
const physicalDataView = document.getElementById("physicalDataView");
const closePhysicalButton = document.getElementById("closePhysicalButton");
const savePhysicalButton = document.getElementById("savePhysicalButton");
const bodyMassInput = document.getElementById("bodyMassInput");
const genderMale = document.getElementById("genderMale");
const genderFemale = document.getElementById("genderFemale");

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

// Load physical data from localStorage
let physicalData = JSON.parse(localStorage.getItem("physicalData")) || { bodyMass: null, gender: null };

// Get current ISO timestamp
function getCurrentTimestamp() {
  return new Date().toISOString();
}

// Format an ISO timestamp to HH:mm for display
function formatTimestamp(ts) {
  const d = new Date(ts);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Returns true if entry is a full ISO timestamp (v2 format)
function isISOTimestamp(ts) {
  return typeof ts === "string" && ts.length > 5 && ts.includes("T");
}

// BAC constants
const BAC_DRINK = { volume: 620, abv: 5.0 };
const BAC_BOTTLE = { volume: 40, abv: 40.0 };
const ETHANOL_DENSITY = 0.789;
const BAC_ELIMINATION_RATE = 0.016;
const R_MALE = 0.68;
const R_FEMALE = 0.55;
const BAC_SOBER_THRESHOLD = 0.05; // 0.05% = 0.5‰

// Calculate alcohol grams for a given volume (ml) and ABV (%)
function alcoholGrams(volumeMl, abv) {
  return volumeMl * (abv / 100) * ETHANOL_DENSITY;
}

// Calculate BAC contribution of a single drink item at a given timestamp
function drinkBACContribution(volumeMl, abv, isoTimestamp, weightKg, r) {
  const grams = alcoholGrams(volumeMl, abv);
  const weightG = weightKg * 1000;
  const rawBAC = (grams / (weightG * r)) * 100;
  const hoursElapsed = (Date.now() - new Date(isoTimestamp).getTime()) / 3600000;
  return Math.max(0, rawBAC - BAC_ELIMINATION_RATE * hoursElapsed);
}

// Calculate current estimated BAC from all logs
function calculateBAC() {
  if (!physicalData.bodyMass || !physicalData.gender) return null;

  const r = physicalData.gender === "male" ? R_MALE : R_FEMALE;
  const weightKg = physicalData.bodyMass;
  let totalBAC = 0;

  logs.drink.forEach((ts) => {
    if (!isISOTimestamp(ts)) return;
    totalBAC += drinkBACContribution(BAC_DRINK.volume, BAC_DRINK.abv, ts, weightKg, r);
  });

  logs.bottle.forEach((ts) => {
    if (!isISOTimestamp(ts)) return;
    totalBAC += drinkBACContribution(BAC_BOTTLE.volume, BAC_BOTTLE.abv, ts, weightKg, r);
  });

  return Math.max(0, totalBAC);
}

// Estimate the clock time when BAC drops below the sober threshold
function soberByTime(currentBAC) {
  if (currentBAC <= BAC_SOBER_THRESHOLD) return null;
  const hoursRemaining = (currentBAC - BAC_SOBER_THRESHOLD) / BAC_ELIMINATION_RATE;
  const soberAt = new Date(Date.now() + hoursRemaining * 3600000);
  return soberAt.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

// Update BAC panel display
function updateBACDisplay() {
  const bac = calculateBAC();

  if (bac === null) {
    bacValue.textContent = "0.00 \u2030";
    bacSober.textContent = "";
    bacNote.textContent = "Enter physical data for BAC estimate";
    bacNote.classList.remove("hidden");
    return;
  }

  bacNote.classList.add("hidden");
  bacValue.textContent = (bac * 10).toFixed(2) + " \u2030";

  const soberTime = soberByTime(bac);
  if (soberTime) {
    bacSober.textContent = "Sober (< 0.5\u2030) by " + soberTime;
  } else {
    bacSober.textContent = "BAC is below 0.5\u2030";
  }
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
  logs.drink.forEach((ts) => {
    const div = document.createElement("div");
    const display = isISOTimestamp(ts) ? formatTimestamp(ts) : ts;
    div.textContent = `Drink ${display}`;
    drinkLog.appendChild(div);
  });

  logs.soda.forEach((ts) => {
    const div = document.createElement("div");
    const display = isISOTimestamp(ts) ? formatTimestamp(ts) : ts;
    div.textContent = `Soda ${display}`;
    sodaLog.appendChild(div);
  });

  logs.fun.forEach((ts) => {
    const div = document.createElement("div");
    const display = isISOTimestamp(ts) ? formatTimestamp(ts) : ts;
    div.textContent = `Fun ${display}`;
    funLog.appendChild(div);
  });

  logs.bottle.forEach((ts) => {
    const div = document.createElement("div");
    const display = isISOTimestamp(ts) ? formatTimestamp(ts) : ts;
    div.textContent = `Bottle ${display}`;
    bottleLog.appendChild(div);
  });

  updateBACDisplay();

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
  const ts = getCurrentTimestamp();
  console.log("Adding drink at:", ts);
  counts.drink++;
  logs.drink.push(ts);
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
  const ts = getCurrentTimestamp();
  console.log("Adding soda at:", ts);
  counts.soda++;
  logs.soda.push(ts);
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
  const ts = getCurrentTimestamp();
  console.log("Adding fun at:", ts);
  counts.fun++;
  logs.fun.push(ts);
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
  const ts = getCurrentTimestamp();
  console.log("Adding bottle at:", ts);
  counts.bottle++;
  logs.bottle.push(ts);
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

// Physical data event listeners
physicalDataToggle.addEventListener("click", () => {
  console.log("Opening physical data view");
  physicalDataView.classList.remove("hidden");
  counterView.classList.add("hidden");
  logView.classList.add("hidden");
  bodyMassInput.value = physicalData.bodyMass || "";
  if (physicalData.gender === "male") genderMale.checked = true;
  if (physicalData.gender === "female") genderFemale.checked = true;
});

closePhysicalButton.addEventListener("click", () => {
  console.log("Closing physical data view");
  physicalDataView.classList.add("hidden");
  counterView.classList.remove("hidden");
});

savePhysicalButton.addEventListener("click", () => {
  const mass = parseFloat(bodyMassInput.value);
  const gender = genderMale.checked ? "male" : genderFemale.checked ? "female" : null;

  if (!mass || mass < 30 || mass > 250) {
    alert("Please enter a valid body mass (30–250 kg).");
    return;
  }
  if (!gender) {
    alert("Please select a gender.");
    return;
  }

  physicalData = { bodyMass: mass, gender };
  localStorage.setItem("physicalData", JSON.stringify(physicalData));
  console.log("Physical data saved:", physicalData);

  physicalDataView.classList.add("hidden");
  counterView.classList.remove("hidden");
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

  const isOpen = !logView.classList.contains("hidden");

  if (isOpen) {
    logView.classList.add("hidden");
    counterView.classList.remove("hidden");
  } else {
    logView.classList.remove("hidden");
    counterView.classList.add("hidden");
    physicalDataView.classList.add("hidden");
    console.log("Log view is now visible");
    updateLogDisplay();
  }
});

// Initialize displays
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing displays");
  updateModeDisplay();
  updateDisplays();
  console.log("Initialization complete");
});
