/*****************************************************************
 * DRR ENGINE – FINAL (MULTI-MONTH SAFE)
 * ---------------------------------------------------------------
 * DRR = Total Units Sold ÷ Total Sale Days (selected months)
 * - Uses filtered sales data
 * - Uses Sale Days sheet correctly
 * - Style-level & SKU-level DRR
 *****************************************************************/

import { getFilteredSalesData } from "../core/data-store.js";
import { getSaleDaysMap } from "../core/data-store.js";

/* ===============================================================
   HELPERS
=============================================================== */

function getTotalSaleDaysForMonths(monthSet, saleDaysMap) {
  let totalDays = 0;

  monthSet.forEach(month => {
    const days = Number(saleDaysMap[month]);
    if (!isNaN(days)) totalDays += days;
  });

  return totalDays || 1; // safety to avoid divide-by-zero
}

/* ===============================================================
   STYLE LEVEL DRR
=============================================================== */

export function calculateStyleDRR() {
  const sales = getFilteredSalesData();
  const saleDaysMap = getSaleDaysMap();

  const styleUnits = {};
  const monthSet = new Set();

  sales.forEach(row => {
    const styleId = row["Style ID"];
    const units = Number(row["Units"]) || 0;
    const month = row["Month"];

    if (!styleId) return;

    styleUnits[styleId] = (styleUnits[styleId] || 0) + units;
    if (month) monthSet.add(month);
  });

  const totalDays = getTotalSaleDaysForMonths(monthSet, saleDaysMap);

  const result = {};
  Object.keys(styleUnits).forEach(styleId => {
    result[styleId] = {
      units: styleUnits[styleId],
      drr: styleUnits[styleId] / totalDays
    };
  });

  return result;
}

/* ===============================================================
   SKU LEVEL DRR
=============================================================== */

export function calculateSkuDRR() {
  const sales = getFilteredSalesData();
  const saleDaysMap = getSaleDaysMap();

  const skuUnits = {};
  const monthSet = new Set();

  sales.forEach(row => {
    const styleId = row["Style ID"];
    const size = row["Size"];
    const units = Number(row["Units"]) || 0;
    const month = row["Month"];

    if (!styleId || !size) return;

    const key = `${styleId}__${size}`;
    skuUnits[key] = {
      styleId,
      size,
      units: (skuUnits[key]?.units || 0) + units
    };

    if (month) monthSet.add(month);
  });

  const totalDays = getTotalSaleDaysForMonths(monthSet, saleDaysMap);

  const result = {};
  Object.keys(skuUnits).forEach(key => {
    result[key] = {
      ...skuUnits[key],
      drr: skuUnits[key].units / totalDays
    };
  });

  return result;
}
