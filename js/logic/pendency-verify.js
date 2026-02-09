/*****************************************************************
 * PENDANCY VERIFICATION
 * ---------------------------------------------------------------
 * Console-only validation
 *****************************************************************/

import {
  calculateSkuPendancy,
  calculateStylePendancy
} from "./pendency-engine.js";

export function verifyPendancy() {
  const stylePendancy = calculateStylePendancy();
  const skuPendancy = calculateSkuPendancy();

  console.group("📦 PENDANCY VERIFICATION");

  console.log("Style Pendancy (sample):");
  console.table(
    Object.values(stylePendancy).slice(0, 10)
  );

  console.log("SKU Pendancy (sample):");
  console.table(
    Object.values(skuPendancy).slice(0, 10)
  );

  console.groupEnd();
}
