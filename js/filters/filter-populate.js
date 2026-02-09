/*****************************************************************
 * FILTER DROPDOWN POPULATOR – LOCKED
 *****************************************************************/

import { AppState } from "../core/state.js";

export function populateFilterDropdowns() {
  populateFC();
  populateCategory();
  populateRemark();
}

/* ===============================
   FC FILTER
================================ */

function populateFC() {
  const select = document.querySelectorAll(".filter-group select")[0];
  if (!select) return;

  const fcs = [...new Set(AppState.rawData.sales.map(r => r.FC).filter(Boolean))];

  select.innerHTML = "";
  select.appendChild(new Option("All FC", "All FC"));
  fcs.sort().forEach(fc => select.appendChild(new Option(fc, fc)));
}

/* ===============================
   CATEGORY FILTER
================================ */

function populateCategory() {
  const select = document.querySelectorAll(".filter-group select")[1];
  if (!select) return;

  const categories = [
    ...new Set(AppState.rawData.styleStatus.map(r => r.Category).filter(Boolean))
  ];

  select.innerHTML = "";
  select.appendChild(new Option("All Categories", "All Categories"));
  categories.sort().forEach(c => select.appendChild(new Option(c, c)));
}

/* ===============================
   COMPANY REMARK FILTER
================================ */

function populateRemark() {
  const select = document.querySelectorAll(".filter-group select")[2];
  if (!select) return;

  const remarks = [
    ...new Set(
      AppState.rawData.styleStatus
        .map(r => r["Company Remark"])
        .filter(Boolean)
    )
  ];

  select.innerHTML = "";
  select.appendChild(new Option("All Company Remarks", "All Company Remarks"));
  remarks.sort().forEach(r => select.appendChild(new Option(r, r)));
}
