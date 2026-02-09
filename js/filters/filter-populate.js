/*****************************************************************
 * FILTER DROPDOWN POPULATOR
 * ---------------------------------------------------------------
 * Rules:
 * - Read-only from AppState.rawData
 * - No filtering logic here
 * - No calculations
 * - No DOM structure changes
 * - Populate values only once after data load
 *****************************************************************/

import { AppState } from "../core/state.js";

export function populateFilterDropdowns() {
  console.group("🔧 Populating Filter Dropdowns");

  populateMonth();
  populateFC();
  populateCategory();
  populateRemark();

  console.groupEnd();
}

/* ===============================
   MONTH FILTER
================================ */

function populateMonth() {
  const select = document.querySelectorAll(".filter-group select")[0];
  if (!select) return;

  const months = Array.from(
    new Set(AppState.rawData.sales.map(r => r.Month).filter(Boolean))
  );

  // Sort months naturally if possible
  months.sort();

  select.innerHTML = "";
  select.appendChild(new Option("Latest Month", "Latest Month"));

  months.forEach(m => {
    select.appendChild(new Option(m, m));
  });

  console.log("✔ Month filter populated:", months.length);
}

/* ===============================
   FC FILTER
================================ */

function populateFC() {
  const select = document.querySelectorAll(".filter-group select")[1];
  if (!select) return;

  const fcs = Array.from(
    new Set(AppState.rawData.sales.map(r => r.FC).filter(Boolean))
  ).sort();

  select.innerHTML = "";
  select.appendChild(new Option("All FC", "All FC"));

  fcs.forEach(fc => {
    select.appendChild(new Option(fc, fc));
  });

  console.log("✔ FC filter populated:", fcs.length);
}

/* ===============================
   CATEGORY FILTER
================================ */

function populateCategory() {
  const select = document.querySelectorAll(".filter-group select")[2];
  if (!select) return;

  const categories = Array.from(
    new Set(
      AppState.rawData.styleStatus.map(r => r.Category).filter(Boolean)
    )
  ).sort();

  select.innerHTML = "";
  select.appendChild(new Option("All Categories", "All Categories"));

  categories.forEach(c => {
    select.appendChild(new Option(c, c));
  });

  console.log("✔ Category filter populated:", categories.length);
}

/* ===============================
   COMPANY REMARK FILTER
================================ */

function populateRemark() {
  const select = document.querySelectorAll(".filter-group select")[3];
  if (!select) return;

  const remarks = Array.from(
    new Set(
      AppState.rawData.styleStatus
        .map(r => r["Company Remark"])
        .filter(Boolean)
    )
  ).sort();

  select.innerHTML = "";
  select.appendChild(
    new Option("All Company Remarks", "All Company Remarks")
  );

  remarks.forEach(r => {
    select.appendChild(new Option(r, r));
  });

  console.log("✔ Company Remark filter populated:", remarks.length);
}
