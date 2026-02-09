import { AppState } from "./state.js";

import { loadSales } from "../data/load-sales.js";
import { loadStock } from "../data/load-stock.js";
import { loadStyleStatus } from "../data/load-style-status.js";
import { loadSaleDays } from "../data/load-sale-days.js";
import { loadSizeCount } from "../data/load-size-count.js";
import { loadProduction } from "../data/load-production.js";

const progressBar = document.getElementById("dataLoadBar");
const progressFill = progressBar.querySelector(".data-load-progress");

function updateProgress() {
  AppState.loadProgress.completed += 1;
  const percent = Math.round(
    (AppState.loadProgress.completed / AppState.loadProgress.total) * 100
  );
  progressFill.style.width = percent + "%";
}

async function loadAllData() {
  progressBar.classList.remove("hidden");

  try {
    await loadSales();        updateProgress();
    await loadStock();        updateProgress();
    await loadStyleStatus();  updateProgress();
    await loadSaleDays();     updateProgress();
    await loadSizeCount();    updateProgress();
    await loadProduction();   updateProgress();
  } catch (err) {
    console.error("Data load error:", err);
  } finally {
    setTimeout(() => {
      progressBar.classList.add("hidden");
    }, 400);
  }
}

document.addEventListener("DOMContentLoaded", loadAllData);
