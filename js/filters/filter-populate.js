/*****************************************************************
 * FILTER POPULATE – FINAL (MONTH DEFAULT = ALL)
 * ---------------------------------------------------------------
 * - Populates all filters
 * - Month filter defaults to ALL months selected
 * - Safe for multi-month DRR logic
 *****************************************************************/

import { getSalesData } from "../core/data-store.js";
import { getStyleStatusData } from "../core/data-store.js";

export function populateFilters() {
  populateMonthFilter();
  populateCategoryFilter();
  populateCompanyRemarkFilter();
}

/* ===============================================================
   MONTH FILTER (ALL SELECTED BY DEFAULT)
=============================================================== */

function populateMonthFilter() {
  const select = document.getElementById("filter-month");
  if (!select) return;

  const sales = getSalesData();
  const monthSet = new Set();

  sales.forEach(row => {
    if (row["Month"]) monthSet.add(row["Month"]);
  });

  const months = Array.from(monthSet).sort();

  select.innerHTML = "";

  months.forEach(month => {
    const option = document.createElement("option");
    option.value = month;
    option.textContent = month;
    option.selected = true; // 🔒 DEFAULT: ALL MONTHS SELECTED
    select.appendChild(option);
  });
}

/* ===============================================================
   CATEGORY FILTER
=============================================================== */

function populateCategoryFilter() {
  const select = document.getElementById("filter-category");
  if (!select) return;

  const styles = getStyleStatusData();
  const set = new Set();

  styles.forEach(row => {
    if (row["Category"]) set.add(row["Category"]);
  });

  select.innerHTML = `<option value="ALL">All Categories</option>`;

  Array.from(set)
    .sort()
    .forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat;
      opt.textContent = cat;
      select.appendChild(opt);
    });
}

/* ===============================================================
   COMPANY REMARK FILTER
=============================================================== */

function populateCompanyRemarkFilter() {
  const select = document.getElementById("filter-remark");
  if (!select) return;

  const styles = getStyleStatusData();
  const set = new Set();

  styles.forEach(row => {
    if (row["Company Remark"]) set.add(row["Company Remark"]);
  });

  select.innerHTML = `<option value="ALL">All Company Remarks</option>`;

  Array.from(set)
    .sort()
    .forEach(r => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = r;
      select.appendChild(opt);
    });
}
