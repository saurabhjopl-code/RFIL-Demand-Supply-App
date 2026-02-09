/*****************************************************************
 * STOCK COVER (SC) VERIFICATION
 * ---------------------------------------------------------------
 * Console-only validation
 *****************************************************************/

import { calculateSkuSC, calculateStyleSC } from "./sc-engine.js";

export function verifySC() {
  const skuSC = calculateSkuSC();
  const styleSC = calculateStyleSC();

  console.group("📈 STOCK COVER (SC) VERIFICATION");

  console.log("Style SC (sample):");
  console.table(
    Object.values(styleSC).slice(0, 10)
  );

  console.log("SKU SC (sample):");
  console.table(
    Object.values(skuSC).slice(0, 10)
  );

  console.groupEnd();
}
