/*****************************************************************
 * STOCK SEPARATION VERIFICATION
 * ---------------------------------------------------------------
 * Console-only validation
 *****************************************************************/

import {
  calculateSkuStock,
  calculateStyleStock
} from "./stock-engine.js";

export function verifyStockSeparation() {
  const skuStock = calculateSkuStock();
  const styleStock = calculateStyleStock();

  console.group("📦 STOCK SEPARATION VERIFICATION");

  console.log("Style Stock (sample):");
  console.table(
    Object.values(styleStock).slice(0, 10)
  );

  console.log("SKU Stock (sample):");
  console.table(
    Object.values(skuStock).slice(0, 10)
  );

  console.groupEnd();
}
