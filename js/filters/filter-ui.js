/*****************************************************************
 * FILTER UI BINDING
 * ---------------------------------------------------------------
 * Rules:
 * - No calculations
 * - No DOM creation
 * - Only read inputs, update state, apply filters
 *****************************************************************/

import { AppState } from "../core/state.js";
import { applyFilters } from "./filter-engine.js";

export function initFilters() {
  const selects = document.querySelectorAll(".filter-group select");
  const searchInput = document.querySelector(".search-input");

  const monthEl = selects[0];
  const fcEl = selects[1];
  const categoryEl = selects[2];
  const remarkEl = selects[3];

  monthEl.addEventListener("change", () => {
    AppState.filters.month = monthEl.value;
    runFilterCycle("Month");
  });

  fcEl.addEventListener("change", () => {
    AppState.filters.fc = fcEl.value;
    runFilterCycle("FC");
  });

  categoryEl.addEventListener("change", () => {
    AppState.filters.category = categoryEl.value;
    runFilterCycle("Category");
  });

  remarkEl.addEventListener("change", () => {
    AppState.filters.remark = remarkEl.value;
    runFilterCycle("Company Remark");
  });

  searchInput.addEventListener("input", () => {
    AppState.filters.search = searchInput.value;
    runFilterCycle("Search");
  });

  // Initial run
  runFilterCycle("Initial Load");
}

/* ===============================
   VERIFICATION LOGGER
================================ */

function runFilterCycle(trigger) {
  const before = AppState.filteredData.sales?.length
    || AppState.rawData.sales.length;

  applyFilters();

  const after = AppState.filteredData.sales.length;

  console.group(`🔎 Filter Applied (${trigger})`);
  console.log("Before:", before);
  console.log("After :", after);
  console.log("Active Filters:", { ...AppState.filters });
  console.groupEnd();
}
