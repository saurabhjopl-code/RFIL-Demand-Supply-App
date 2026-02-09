/*****************************************************************
 * APP INIT – MASTER BOOTSTRAP FILE (SAFE VERSION)
 * ---------------------------------------------------------------
 * Rules:
 * - NO top-level await
 * - NO UI changes
 * - Progress bar must always resolve
 * - Long & explicit is preferred
 *****************************************************************/

import { AppState } from "./state.js";
import { sanityCheck } from "./utils.js";

/* ===============================
   DATA LOADERS
================================ */

import { loadSales } from "../data/load-sales.js";
import { loadStock } from "../data/load-stock.js";
import { loadStyleStatus } from "../data/load-style-status.js";
import { loadSaleDays } from "../data/load-sale-days.js";
import { loadSizeCount } from "../data/load-size-count.js";
import { loadProduction } from "../data/load-production.js";

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
   SANITY CHECK PHASE (LOCKED)
================================ */

function runSanityChecks() {
  console.group("🧪 DATA SANITY CHECKS");

  sanityCheck("Sales", AppState.rawData.sales);
  sanityCheck("Stock", AppState.rawData.stock);
  sanityCheck("Style Status", AppState.rawData.styleStatus);
  sanityCheck("Sale Days", AppState.rawData.saleDays);
  sanityCheck("Size Count", AppState.rawData.sizeCount);
  sanityCheck("Production", AppState.rawData.production);

  console.groupEnd();
}

/* ===============================
   FILTER INIT (SAFE IMPORT)
================================ */

async function initFiltersSafely() {
  try {
    const module = await import("../filters/filter-ui.js");
    if (typeof module.initFilters === "function") {
      module.initFilters();
      console.log("✔ Filters initialized");
    }
  } catch (e) {
    console.warn("ℹ Filters not initialized yet (safe to ignore)", e);
  }
}

/* ===============================
   MAIN LOAD SEQUENCE
================================ */

async function loadAllData() {
  showProgressBar();

  await safeLoad(loadSales, "Sales");
  await safeLoad(loadStock, "Stock");
  await safeLoad(loadStyleStatus, "Style Status");
  await safeLoad(loadSaleDays, "Sale Days");
  await safeLoad(loadSizeCount, "Size Count");
  await safeLoad(loadProduction, "Production");

  console.log("✅ Data loading phase completed");

  runSanityChecks();

  await initFiltersSafely();

  hideProgressBar();
}

/* ===============================
   DOM READY ENTRY
================================ */

document.addEventListener("DOMContentLoaded", () => {
  try {
    loadAllData();
  } catch (e) {
    console.error("❌ Fatal init error", e);
    hideProgressBar();
  }
});
