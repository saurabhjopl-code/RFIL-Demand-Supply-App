/*****************************************************************
 * BUY BUCKET VERIFICATION
 * ---------------------------------------------------------------
 * Console-only validation
 *****************************************************************/

import {
  calculateSkuBuyBucket,
  calculateStyleBuyBucket
} from "./buy-bucket-engine.js";

export function verifyBuyBuckets() {
  const skuBuckets = calculateSkuBuyBucket();
  const styleBuckets = calculateStyleBuyBucket();

  console.group("🚦 BUY BUCKET VERIFICATION");

  console.log("Style Buy Buckets (sample):");
  console.table(
    Object.values(styleBuckets).slice(0, 10)
  );

  console.log("SKU Buy Buckets (sample):");
  console.table(
    Object.values(skuBuckets).slice(0, 10)
  );

  console.groupEnd();
}
