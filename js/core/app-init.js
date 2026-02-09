/*****************************************************************
 * APP INIT – MASTER BOOTSTRAP (STABLE & SAFE)
 * ---------------------------------------------------------------
 * NON-NEGOTIABLE RULES:
 * - UI IS LOCKED FOREVER
 * - No top-level await
 * - Long & explicit > short & clever
 * - Progress bar must ALWAYS resolve
 *****************************************************************/

import { AppState } from "./state.js";
import { sanityCheck } from "./utils.js";

/* ===============================
   DATA LOADERS (CSV)
================================ */

import { loadSales } from "../data/load-sales.js";
import { loadStock } from "../data/load-stock.js";
import { loadStyleStatus } from "../data/load-style-status.js";
import { loadSaleDays } from "../data/load-sale-days.js";
import { loadSizeCount } from "../data/load-size-count.js";
import { loadProduction } from "../data/load-production.js";

/* ===============================
   FILTER MODULES
================================ */

import { populateFilterDropdowns } from "../filters/filter-populate.js";
import { initFilters } from "../filters/filter-ui.js";

/* ===============================
   PROGRESS BAR ELEMENTS
================================ */

const progressBar = document.getElementById("dataLoadBar");
const progressFill = progressBar.querySelector(".data-load-progress");
const progressText = progressBar.querySelector(".data-load-text");

/* ===============================
   PROGRESS BAR HELPERS
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
   SANITY CHECKS (LOCKED)
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

  // IMPORTANT: order is intentional and fixed
  await safeLoad(loadSales, "Sales");
  await safeLoad(loadStock, "Stock");
  await safeLoad(loadStyleStatus, "Style Status");
  await safeLoad(loadSaleDays, "Sale Days");
  await safeLoad(loadSizeCount, "Size Count");
  await safeLoad(loadProduction, "Production");

  console.log("✅ Data loading phase completed");

  /* ---------- SANITY CHECK ---------- */
  runSanityChecks();

  /* ---------- FILTER DROPDOWN POPULATION ---------- */
  try {
    populateFilterDropdowns();
    console.log("✔ Filter dropdowns populated");
  } catch (e) {
    console.error("✖ Failed to populate filter dropdowns", e);
  }

  /* ---------- FILTER EVENT BINDING ---------- */
  try {
    initFilters();
    console.log("✔ Filter listeners initialized");
  } catch (e) {
    console.warn("ℹ Filter listeners not initialized yet", e);
  }

  hideProgressBar();
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

/* === SAME app-init.js AS BEFORE === */
/* NOTHING REMOVED */
/* ONLY ONE ADDITION BELOW */

import { verifyDRR } from "../logic/drr-verify.js";

/* inside loadAllData(), AFTER filters init */

  /* ---------- DRR VERIFICATION ---------- */
  try {
    verifyDRR();
    console.log("✔ DRR calculated successfully");
  } catch (e) {
    console.error("✖ DRR calculation failed", e);
  }
