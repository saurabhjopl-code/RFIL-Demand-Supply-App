/*****************************************************************
 * BUY BUCKET SUMMARY VERIFICATION
 * ---------------------------------------------------------------
 * Console-only validation
 *****************************************************************/

import { calculateBuyBucketSummary } from "./buy-bucket-summary-engine.js";

export function verifyBuyBucketSummary() {
  const summary = calculateBuyBucketSummary();

  console.group("📊 BUY BUCKET SUMMARY VERIFICATION");

  console.table(summary);

  console.groupEnd();
}
