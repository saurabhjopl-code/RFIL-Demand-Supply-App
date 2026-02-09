/*****************************************************************
 * STOCK COVER (SC) ENGINE – FINAL
 * ---------------------------------------------------------------
 * SC = Seller Stock ÷ DRR
 *
 * Rules:
 * - Seller Stock ONLY
 * - DRR must already be calculated
 * - If DRR = 0 → SC = 0
 * - No UI
 * - No DOM
 *****************************************************************/

import { calculateSkuDRR, calculateStyleDRR } from "./drr-engine.js";
import { calculateSkuStock, calculateStyleStock } from "./stock-engine.js";

/* ===============================
   SKU LEVEL STOCK COVER
================================ */

export function calculateSkuSC() {
  const skuDRR = calculateSkuDRR();
  const skuStock = calculateSkuStock();
  const result = {};

  Object.keys(skuStock).forEach(key => {
    const stock = skuStock[key];
    const drrRow = skuDRR[key];

    const sellerStock = stock.sellerStock || 0;
    const drr = drrRow ? drrRow.drr : 0;

    result[key] = {
      styleId: stock.styleId,
      size: stock.size,
      sellerStock,
      drr,
      sc: drr > 0 ? +(sellerStock / drr).toFixed(2) : 0
    };
  });

  return result;
}

/* ===============================
   STYLE LEVEL STOCK COVER
================================ */

export function calculateStyleSC() {
  const styleDRR = calculateStyleDRR();
  const styleStock = calculateStyleStock();
  const result = {};

  Object.keys(styleStock).forEach(styleId => {
    const stock = styleStock[styleId];
    const drrRow = styleDRR[styleId];

    const sellerStock = stock.sellerStock || 0;
    const drr = drrRow ? drrRow.drr : 0;

    result[styleId] = {
      styleId,
      sellerStock,
      drr,
      sc: drr > 0 ? +(sellerStock / drr).toFixed(2) : 0
    };
  });

  return result;
}
