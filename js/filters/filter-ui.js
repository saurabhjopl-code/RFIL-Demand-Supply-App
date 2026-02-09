import { AppState } from "../core/state.js";
import { applyFilters } from "./filter-engine.js";

export function initFilters() {
  const monthEl = document.querySelector(".filter-group select");
  const fcEl = document.querySelectorAll(".filter-group select")[1];
  const catEl = document.querySelectorAll(".filter-group select")[2];
  const remarkEl = document.querySelectorAll(".filter-group select")[3];
  const searchEl = document.querySelector(".search-input");

  monthEl.addEventListener("change", e => {
    AppState.filters.month = e.target.value;
    applyFilters();
    logFilteredCount();
  });

  fcEl.addEventListener("change", e => {
    AppState.filters.fc = e.target.value;
    applyFilters();
    logFilteredCount();
  });

  catEl.addEventListener("change", e => {
    AppState.filters.category = e.target.value;
    applyFilters();
    logFilteredCount();
  });

  remarkEl.addEventListener("change", e => {
    AppState.filters.remark = e.target.value;
    applyFilters();
    logFilteredCount();
  });

  searchEl.addEventListener("input", e => {
    AppState.filters.search = e.target.value;
    applyFilters();
    logFilteredCount();
  });
}

function logFilteredCount() {
  console.log(
    `🔎 Filtered Sales Rows: ${AppState.filteredData.sales.length}`
  );
}
