/*****************************************************************
 * DRR ENGINE – DAILY RUN RATE
 * ---------------------------------------------------------------
 * DRR = Units Sold ÷ Sale Days
 *
 * Rules:
 * - Uses FILTERED sales data
 * - Uses Sale Days sheet
 * - No DOM
 * - No UI
 * - Pure reusable logic
 *****************************************************************/

import { AppState } from "../core/state.js";

/* ===============================
   HELPERS
================================ */

function getSaleDaysMap() {
  const map = {};
  AppState.rawData.saleDays.forEach(row => {
    const month = row.Month;
    const days = Number(row.Days) || 0;
    if (month) map[month] = days;
  });
  return map;
}

/* ===============================
   SKU LEVEL DRR
================================ */

export function calculateSkuDRR() {
  const saleDaysMap = getSaleDaysMap();
  const result = {};

  AppState.filteredData.sales.forEach(row => {
    const key = `${row["Style ID"]}__${row.Size}`;
    const units = Number(row.Units) || 0;
    const days = saleDaysMap[row.Month] || 0;

    if (!result[key]) {
      result[key] = {
        styleId: row["Style ID"],
        size: row.Size,
        units: 0,
        days: 0,
        drr: 0
      };
    }

    result[key].units += units;
    result[key].days += days;
  });

  Object.values(result).forEach(r => {
    r.drr = r.days > 0 ? +(r.units / r.days).toFixed(2) : 0;
  });

  return result;
}

/* ===============================
   STYLE LEVEL DRR
================================ */

export function calculateStyleDRR() {
  const saleDaysMap = getSaleDaysMap();
  const result = {};

  AppState.filteredData.sales.forEach(row => {
    const styleId = row["Style ID"];
    const units = Number(row.Units) || 0;
    const days = saleDaysMap[row.Month] || 0;

    if (!result[styleId]) {
      result[styleId] = {
        styleId,
        units: 0,
        days: 0,
        drr: 0
      };
    }

    result[styleId].units += units;
    result[styleId].days += days;
  });

  Object.values(result).forEach(r => {
    r.drr = r.days > 0 ? +(r.units / r.days).toFixed(2) : 0;
  });

  return result;
}
