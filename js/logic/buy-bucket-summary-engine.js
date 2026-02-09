/*****************************************************************
 * BUY BUCKET SUMMARY ENGINE – FINAL
 * ---------------------------------------------------------------
 * Output per bucket:
 * - bucket
 * - styleCount
 * - skuCount
 * - totalPendancy
 *****************************************************************/

import { calculateSkuBuyBucket, calculateStyleBuyBucket } from "./buy-bucket-engine.js";
import { calculateSkuPendancy, calculateStylePendancy } from "./pendency-engine.js";

/* ===============================
   INITIAL BUCKET STRUCTURE
================================ */

function createEmptySummary() {
  return {
    URGENT: { bucket: "URGENT", styleCount: 0, skuCount: 0, totalPendancy: 0 },
    MEDIUM: { bucket: "MEDIUM", styleCount: 0, skuCount: 0, totalPendancy: 0 },
    LOW: { bucket: "LOW", styleCount: 0, skuCount: 0, totalPendancy: 0 },
    OVER_PROD: { bucket: "OVER_PROD", styleCount: 0, skuCount: 0, totalPendancy: 0 }
  };
}

/* ===============================
   BUY BUCKET SUMMARY
================================ */

export function calculateBuyBucketSummary() {
  const summary = createEmptySummary();

  const skuBuckets = calculateSkuBuyBucket();
  const styleBuckets = calculateStyleBuyBucket();
  const skuPendancy = calculateSkuPendancy();
  const stylePendancy = calculateStylePendancy();

  /* ---------- STYLE COUNT & STYLE PENDANCY ---------- */
  Object.values(styleBuckets).forEach(style => {
    const bucket = style.bucket;
    if (!summary[bucket]) return;

    summary[bucket].styleCount += 1;
    summary[bucket].totalPendancy += stylePendancy[style.styleId]?.pendancy || 0;
  });

  /* ---------- SKU COUNT ---------- */
  Object.keys(skuBuckets).forEach(key => {
    const bucket = skuBuckets[key].bucket;
    if (!summary[bucket]) return;

    summary[bucket].skuCount += 1;
  });

  return Object.values(summary);
}
