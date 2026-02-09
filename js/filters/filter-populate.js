/*****************************************************************
 * FILTER DROPDOWN POPULATOR – FINAL (MONTH REMOVED)
 * ---------------------------------------------------------------
 * Rules:
 * - Read-only from AppState.rawData
 * - No filtering logic here
 * - No calculations
 * - No DOM structure changes
 * - Month dropdown removed completely
 *****************************************************************/

import { AppState } from "../core/state.js";

export function populateFilterDropdowns() {
  console.group("🔧 Populating Filter Dropdowns");

  populateFC();
  populateCategory();
  populateRemark();

  console.groupEnd();
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
