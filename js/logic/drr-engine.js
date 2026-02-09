/*****************************************************************
 * DRR ENGINE – FINAL & LOCKED
 * ---------------------------------------------------------------
 * DRR = Total Units Sold ÷ Total Sale Days
 *
 * IMPORTANT:
 * - Sale Days is TOTAL of ALL rows in Sale Days sheet
 * - Month filters DO NOT affect Sale Days
 * - Filters affect ONLY Units Sold
 *****************************************************************/

import { getFilteredSalesData } from "../core/data-store.js";
import { getSaleDaysData } from "../core/data-store.js";

/* ===============================================================
   HELPERS
=============================================================== */

function getTotalSaleDays() {
  const saleDays = getSaleDaysData();
  let total = 0;

  saleDays.forEach(row => {
    const days = Number(row["Days"]);
    if (!isNaN(days)) total += days;
  });

  return total || 1; // safety
}

/* ===============================================================
   STYLE LEVEL DRR
=============================================================== */

export function calculateStyleDRR() {
  const sales = getFilteredSalesData();
  const totalSaleDays = getTotalSaleDays();

  const styleUnits = {};

  sales.forEach(row => {
    const styleId = row["Style ID"];
    const units = Number(row["Units"]) || 0;

    if (!styleId) return;

    styleUnits[styleId] = (styleUnits[styleId] || 0) + units;
  });

  const result = {};
  Object.keys(styleUnits).forEach(styleId => {
    result[styleId] = {
      units: styleUnits[styleId],
      drr: styleUnits[styleId] / totalSaleDays
    };
  });

  return result;
}

/* ===============================================================
   SKU LEVEL DRR
=============================================================== */

export function calculateSkuDRR() {
  const sales = getFilteredSalesData();
  const totalSaleDays = getTotalSaleDays();

  const skuUnits = {};

  sales.forEach(row => {
    const styleId = row["Style ID"];
    const size = row["Size"];
    const units = Number(row["Units"]) || 0;

    if (!styleId || !size) return;

    const key = `${styleId}__${size}`;

    skuUnits[key] = {
      styleId,
      size,
      units: (skuUnits[key]?.units || 0) + units
    };
  });

  const result = {};
  Object.keys(skuUnits).forEach(key => {
    result[key] = {
      ...skuUnits[key],
      drr: skuUnits[key].units / totalSaleDays
    };
  });

  return result;
}
