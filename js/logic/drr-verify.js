/*****************************************************************
 * DRR VERIFICATION (CONSOLE ONLY)
 * ---------------------------------------------------------------
 * This file is for validation only.
 * Can be removed later if you want.
 *****************************************************************/

import { calculateSkuDRR, calculateStyleDRR } from "./drr-engine.js";

export function verifyDRR() {
  const skuDRR = calculateSkuDRR();
  const styleDRR = calculateStyleDRR();

  console.group("📊 DRR VERIFICATION");

  console.log("Style DRR (sample):");
  console.table(
    Object.values(styleDRR).slice(0, 10)
  );

  console.log("SKU DRR (sample):");
  console.table(
    Object.values(skuDRR).slice(0, 10)
  );

  console.groupEnd();
}
