import { AppState } from "./state.js";
import { sanityCheck } from "./utils.js";

import { loadSales } from "../data/load-sales.js";
import { loadStock } from "../data/load-stock.js";
import { loadStyleStatus } from "../data/load-style-status.js";
import { loadSaleDays } from "../data/load-sale-days.js";
import { loadSizeCount } from "../data/load-size-count.js";
import { loadProduction } from "../data/load-production.js";

const progressBar = document.getElementById("dataLoadBar");
const progressFill = progressBar.querySelector(".data-load-progress");
const progressText = progressBar.querySelector(".data-load-text");

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
  } catch (err) {
    console.error(`✖ Failed to load: ${label}`, err);
  } finally {
    updateProgress(label);
  }
}

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

async function loadAllData() {
  progressBar.classList.remove("hidden");

  await safeLoad(loadSales, "Sales");
  await safeLoad(loadStock, "Stock");
  await safeLoad(loadStyleStatus, "Style Status");
  await safeLoad(loadSaleDays, "Sale Days");
  await safeLoad(loadSizeCount, "Size Count");
  await safeLoad(loadProduction, "Production");

  setTimeout(() => {
    progressBar.classList.add("hidden");
    console.log("✅ Data loading phase completed");

    runSanityChecks(); // 👈 critical checkpoint
  }, 300);
}

document.addEventListener("DOMContentLoaded", loadAllData);
