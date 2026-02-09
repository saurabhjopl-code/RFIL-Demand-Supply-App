/*****************************************************************
 * PENDANCY ENGINE – FINAL BUY QUANTITY
 * ---------------------------------------------------------------
 * Pendancy = Direct Demand − In Production
 *
 * Rules:
 * - In Production reduces buying requirement
 * - Negative pendancy = over-production
 * - No flooring
 * - No UI
 * - No DOM
 *****************************************************************/

import {
  calculateSkuDirectDemand,
  calculateStyleDirectDemand
} from "./direct-demand-engine.js";

import { AppState } from "../core/state.js";

/* ===============================
   PRODUCTION MAP HELPERS
================================ */

function getSkuProductionMap() {
  const map = {};

  AppState.rawData.production.forEach(row => {
    const sku = row["Uniware SKU"];
    const qty = Number(row["Production Plann"]) || 0;

    if (!sku) return;

    if (!map[sku]) map[sku] = 0;
    map[sku] += qty;
  });

  return map;
}

/* ===============================
   SKU LEVEL PENDANCY
================================ */

export function calculateSkuPendancy() {
  const skuDemand = calculateSkuDirectDemand();
  const productionMap = getSkuProductionMap();
  const result = {};

  Object.keys(skuDemand).forEach(key => {
    const row = skuDemand[key];

    // SKU identity
    const uniwareSku = row.uniwareSku || null;
    const inProduction = uniwareSku
      ? (productionMap[uniwareSku] || 0)
      : 0;

    const pendancy = row.directDemand - inProduction;

    result[key] = {
      styleId: row.styleId,
      size: row.size,
      directDemand: row.directDemand,
      inProduction,
      pendancy
    };
  });

  return result;
}

/* ===============================
   STYLE LEVEL PENDANCY
================================ */

export function calculateStylePendancy() {
  const styleDemand = calculateStyleDirectDemand();
  const skuPendancy = calculateSkuPendancy();
  const result = {};

  Object.keys(styleDemand).forEach(styleId => {
    if (!result[styleId]) {
      result[styleId] = {
        styleId,
        directDemand: styleDemand[styleId].directDemand,
        inProduction: 0,
        pendancy: 0
      };
    }
  });

  Object.values(skuPendancy).forEach(row => {
    if (!result[row.styleId]) return;
    result[row.styleId].inProduction += row.inProduction;
  });

  Object.values(result).forEach(r => {
    r.pendancy = r.directDemand - r.inProduction;
  });

  return result;
}
