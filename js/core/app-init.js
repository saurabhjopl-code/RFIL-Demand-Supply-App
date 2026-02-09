/*****************************************************************
 * APP INIT – FINAL STABLE BOOTSTRAP (LOCKED)
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
   FILTERS
================================ */

import { populateFilterDropdowns } from "../filters/filter-populate.js";
import { initFilters } from "../filters/filter-ui.js";
import { applyFilters } from "../filters/filter-engine.js";

/* ===============================
   REPORTS
================================ */

import { renderDemandReport } from "../reports/demand-report.js";

/* ===============================
   PROGRESS BAR
================================ */

const progressBar = document.getElementById("dataLoadBar");
const progressFill = progressBar.querySelector(".data-load-progress");
const progressText = progressBar.querySelector(".data-load-text");

/* ===============================
   HELPERS
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

async function safeLoad(fn, label) {
  try {
    await fn();
    console.log(`✔ Loaded: ${label}`);
  } catch (e) {
    console.error(`✖ Failed to load: ${label}`, e);
  } finally {
    updateProgress(label);
  }
}

/* ===============================
   SANITY
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
   MAIN FLOW
================================ */

async function loadAllData() {
  showProgressBar();

  await safeLoad(loadSales, "Sales");
  await safeLoad(loadStock, "Stock");
  await safeLoad(loadStyleStatus, "Style Status");
  await safeLoad(loadSaleDays, "Sale Days");
  await safeLoad(loadSizeCount, "Size Count");
  await safeLoad(loadProduction, "Production");

  console.log("✅ Data loading completed");

  runSanityChecks();

  /* ---------- FILTER SETUP ---------- */
  populateFilterDropdowns();
  initFilters();

  /* 🔒 CRITICAL: FIRST FILTER PASS */
  applyFilters();

  /* ---------- DEMAND REPORT ---------- */
  renderDemandReport();

  hideProgressBar();
}

document.addEventListener("DOMContentLoaded", () => {
  loadAllData();
});
