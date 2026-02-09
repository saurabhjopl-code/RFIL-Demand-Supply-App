/*****************************************************************
 * DIRECT DEMAND ENGINE – FINAL
 * ---------------------------------------------------------------
 * Direct Demand = (DRR × TARGET_DAYS) − Seller Stock
 *
 * Rules:
 * - TARGET_DAYS = 45 (LOCKED)
 * - Seller Stock ONLY
 * - If result < 0 → 0
 * - No UI
 * - No DOM
 *****************************************************************/

import { calculateSkuDRR, calculateStyleDRR } from "./drr-engine.js";
import { calculateSkuStock, calculateStyleStock } from "./stock-engine.js";

const TARGET_DAYS = 45;

/* ===============================
   SKU LEVEL DIRECT DEMAND
================================ */

export function calculateSkuDirectDemand() {
  const skuDRR = calculateSkuDRR();
  const skuStock = calculateSkuStock();
  const result = {};

  Object.keys(skuStock).forEach(key => {
    const stock = skuStock[key];
    const drrRow = skuDRR[key];

    const sellerStock = stock.sellerStock || 0;
    const drr = drrRow ? drrRow.drr : 0;

    const requiredQty = drr * TARGET_DAYS;
    const directDemand = Math.max(
      0,
      Math.round(requiredQty - sellerStock)
    );

    result[key] = {
      styleId: stock.styleId,
      size: stock.size,
      sellerStock,
      drr,
      targetDays: TARGET_DAYS,
      directDemand
    };
  });

  return result;
}

/* ===============================
   STYLE LEVEL DIRECT DEMAND
================================ */

export function calculateStyleDirectDemand() {
  const styleDRR = calculateStyleDRR();
  const styleStock = calculateStyleStock();
  const result = {};

  Object.keys(styleStock).forEach(styleId => {
    const stock = styleStock[styleId];
    const drrRow = styleDRR[styleId];

    const sellerStock = stock.sellerStock || 0;
    const drr = drrRow ? drrRow.drr : 0;

    const requiredQty = drr * TARGET_DAYS;
    const directDemand = Math.max(
      0,
      Math.round(requiredQty - sellerStock)
    );

    result[styleId] = {
      styleId,
      sellerStock,
      drr,
      targetDays: TARGET_DAYS,
      directDemand
    };
  });

  return result;
}
