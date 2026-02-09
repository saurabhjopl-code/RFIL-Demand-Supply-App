/*****************************************************************
 * FILTER ENGINE – FINAL (MONTH REMOVED)
 * ---------------------------------------------------------------
 * Rules:
 * - Never mutate rawData
 * - Write only to filteredData
 * - No DOM access
 * - Search overrides all other filters
 * - Month logic completely removed
 *****************************************************************/

import { AppState } from "../core/state.js";

export function applyFilters() {
  const rawSales = AppState.rawData.sales || [];
  let result = [...rawSales];

  const f = AppState.filters;

  /* ===============================
     SEARCH OVERRIDE
  ================================ */
  if (f.search && f.search.trim() !== "") {
    const q = f.search.toLowerCase();

    result = result.filter(r =>
      (r["Style ID"] && r["Style ID"].toLowerCase().includes(q)) ||
      (r["MP SKU"] && r["MP SKU"].toLowerCase().includes(q)) ||
      (r["Uniware SKU"] && r["Uniware SKU"].toLowerCase().includes(q))
    );

    AppState.filteredData.sales = result;
    return;
  }

  /* ===============================
     FC FILTER
  ================================ */
  if (f.fc && f.fc !== "All FC") {
    result = result.filter(r => r.FC === f.fc);
  }

  /* ===============================
     CATEGORY FILTER
  ================================ */
  if (f.category && f.category !== "All Categories") {
    const allowedStyles = new Set(
      AppState.rawData.styleStatus
        .filter(s => s.Category === f.category)
        .map(s => s["Style ID"])
    );

    result = result.filter(r => allowedStyles.has(r["Style ID"]));
  }

  /* ===============================
     COMPANY REMARK FILTER
  ================================ */
  if (f.remark && f.remark !== "All Company Remarks") {
    const allowedStyles = new Set(
      AppState.rawData.styleStatus
        .filter(s => s["Company Remark"] === f.remark)
        .map(s => s["Style ID"])
    );

    result = result.filter(r => allowedStyles.has(r["Style ID"]));
  }

  AppState.filteredData.sales = result;
}
