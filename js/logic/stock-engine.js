/*****************************************************************
 * STOCK ENGINE – SELLER vs FC (FINAL & CORRECT)
 * ---------------------------------------------------------------
 * BUSINESS RULE (LOCKED):
 * - FC column value === "SELLER" → Seller Stock
 * - ALL other values             → FC Stock
 *
 * Seller Stock is used for:
 * - Stock Cover (SC)
 * - Demand
 * - Pendancy
 *
 * FC Stock is:
 * - Visibility only
 * - NEVER used in calculations
 *****************************************************************/

import { AppState } from "../core/state.js";

/* ===============================
   HELPERS
================================ */

function isSellerStock(row) {
  return String(row.FC).trim().toUpperCase() === "SELLER";
}

function normalizeUnits(value) {
  return Number(value) || 0;
}

/* ===============================
   SKU LEVEL STOCK SPLIT
================================ */

export function calculateSkuStock() {
  const result = {};

  AppState.rawData.stock.forEach(row => {
    const styleId = row["Style ID"];
    const size = row.Size;
    const key = `${styleId}__${size}`;

    if (!result[key]) {
      result[key] = {
        styleId,
        size,
        sellerStock: 0,
        fcStock: 0,
        totalStock: 0
      };
    }

    const units = normalizeUnits(row.Units);

    if (isSellerStock(row)) {
      result[key].sellerStock += units;
    } else {
      result[key].fcStock += units;
    }

    result[key].totalStock += units;
  });

  return result;
}

/* ===============================
   STYLE LEVEL STOCK SPLIT
================================ */

export function calculateStyleStock() {
  const skuStock = calculateSkuStock();
  const result = {};

  Object.values(skuStock).forEach(row => {
    const styleId = row.styleId;

    if (!result[styleId]) {
      result[styleId] = {
        styleId,
        sellerStock: 0,
        fcStock: 0,
        totalStock: 0
      };
    }

    result[styleId].sellerStock += row.sellerStock;
    result[styleId].fcStock += row.fcStock;
    result[styleId].totalStock += row.totalStock;
  });

  return result;
}
