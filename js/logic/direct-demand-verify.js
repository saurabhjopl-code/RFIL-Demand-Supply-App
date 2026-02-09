/*****************************************************************
 * DIRECT DEMAND VERIFICATION
 * ---------------------------------------------------------------
 * Console-only validation
 *****************************************************************/

import {
  calculateSkuDirectDemand,
  calculateStyleDirectDemand
} from "./direct-demand-engine.js";

export function verifyDirectDemand() {
  const skuDemand = calculateSkuDirectDemand();
  const styleDemand = calculateStyleDirectDemand();

  console.group("📦 DIRECT DEMAND VERIFICATION");

  console.log("Style Direct Demand (sample):");
  console.table(
    Object.values(styleDemand).slice(0, 10)
  );

  console.log("SKU Direct Demand (sample):");
  console.table(
    Object.values(skuDemand).slice(0, 10)
  );

  console.groupEnd();
}
