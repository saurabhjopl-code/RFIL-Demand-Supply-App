/*****************************************************************
 * APP INIT – MASTER BOOTSTRAP FILE
 * ---------------------------------------------------------------
 * Rules:
 * - UI is LOCKED
 * - This file may grow, but existing logic must NOT be removed
 * - All loaders must be fail-safe
 * - Progress bar must never get stuck
 *****************************************************************/

import { AppState } from "./state.js";
import { sanityCheck } from "./utils.js";

/* ===============================
   DATA LOADERS
================================ */
import { populateFilterDropdowns } from "../filters/filter-populate.js";
import { loadSales } from "../data/load-sales.js";
import { loadStock } from "../data/load-stock.js";
import { loadStyleStatus } from "../data/load-style-status.js";
import { loadSaleDays } from "../data/load-sale-days.js";
import { loadSizeCount } from "../data/load-size-count.js";
import { loadProduction } from "../data/load-production.js";

/* ===============================
   OPTIONAL INITIALIZERS
   (These may or may not exist yet)
================================ */

// Filters will be wired later – keep safe guard
let initFiltersFn = null;
try {
  const filters = await import("../filters/filter-ui.js");
  initFiltersFn = filters.initFilters;
} catch (e) {
  console.warn("ℹ Filters not initialized yet");
}

/* ===============================
   PROGRESS BAR REFERENCES
================================ */

const progressBar = document.getElementById("dataLoadBar");
const progressFill = progressBar.querySelector(".data-load-progress");
const progressText = progressBar.querySelector(".data-load-text");

/* ===============================
   PROGRESS HELPERS
================================ */

function showProgressBar() {
  progressBar.classList.remove("hidden");
  progressFill.style.width = "0%";
  progressText.textContent = "Starting data load...";
}

function hideProgressBar() {
  setTimeout(() => {
    progressBar.classList.add("hidden");
  }, 300);
}

function updateProgress(label) {
  AppState.loadProgress.completed += 1;

  const percent = Math.round(
    (AppState.loadProgress.completed / AppState.loadProgress.total) * 100
  );

  progressFill.style.width = percent + "%";
  progressText.textContent = `Loading ${label}... (${percent}%)`;
}

/* ===============================
   SAFE LOADER WRAPPER
================================ */

async function safeLoad(loaderFn, label) {
  try {
    await loaderFn();
    console.log(`✔ Loaded: ${label}`);
  } catch (err) {
    console.error(`✖ Failed to load: ${label}`, err);
  } finally {
    updateProgress(label);
  }
}

/* ===============================
   SANITY CHECK PHASE
   (LOCKED – DO NOT MODIFY)
================================ */

function runSanityChecks() {
  console.group("🧪 DATA SANITY CHECKS");

  sanityCheck(
    "Sales",
    AppState.rawData.sales,
    ["Month", "FC", "Style ID", "Size", "Units"]
  );

  sanityCheck(
    "Stock",
    AppState.rawData.stock,
    ["FC", "Style ID", "Size", "Units"]
  );

  sanityCheck(
    "Style Status",
    AppState.rawData.styleStatus,
    ["Style ID", "Category", "Company Remark"]
  );

  sanityCheck(
    "Sale Days",
    AppState.rawData.saleDays,
    ["Month", "Days"]
  );

  sanityCheck(
    "Size Count",
    AppState.rawData.sizeCount,
    ["Style ID", "Size Count"]
  );

  sanityCheck(
    "Production",
    AppState.rawData.production,
    ["Uniware SKU", "Production Plann"]
  );

  console.groupEnd();
}

/* ===============================
   MAIN DATA LOAD SEQUENCE
================================ */



async function loadAllData() {
  showProgressBar();

  // IMPORTANT: order is explicit and intentional
  await safeLoad(loadSales, "Sales");
  await safeLoad(loadStock, "Stock");
  await safeLoad(loadStyleStatus, "Style Status");
  await safeLoad(loadSaleDays, "Sale Days");
  await safeLoad(loadSizeCount, "Size Count");
  await safeLoad(loadProduction, "Production");

  console.log("✅ Data loading phase completed");

  // Run sanity checks only after all loaders attempted
  runSanityChecks();

  // Initialize filters ONLY if available
  if (typeof initFiltersFn === "function") {
    try {
      initFiltersFn();
      console.log("✔ Filters initialized");
    } catch (e) {
      console.error("✖ Filter initialization failed", e);
    }
  }

  hideProgressBar();
     // -------------------------------
  // Populate filter dropdown values
  // -------------------------------
  try {
    populateFilterDropdowns();
    console.log("✔ Filter dropdowns populated");
  } catch (e) {
    console.error("✖ Failed to populate filter dropdowns", e);
  }

}

/* ===============================
   DOM READY ENTRY POINT
================================ */

document.addEventListener("DOMContentLoaded", () => {
  try {
    loadAllData();
  } catch (e) {
    console.error("❌ Fatal error during app initialization", e);
    hideProgressBar();
  }
});


