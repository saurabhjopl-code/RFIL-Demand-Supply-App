/*****************************************************************
 * BUY BUCKET ENGINE – FINAL
 * ---------------------------------------------------------------
 * Bucket is derived ONLY from Pendancy
 *
 * Priority Order:
 * URGENT > MEDIUM > LOW > OVER_PROD
 *****************************************************************/

import {
  calculateSkuPendancy,
  calculateStylePendancy
} from "./pendency-engine.js";

/* ===============================
   BUCKET RULES
================================ */

function getBucket(pendancy) {
  if (pendancy > 500) return "URGENT";
  if (pendancy >= 100) return "MEDIUM";
  if (pendancy >= 0) return "LOW";
  return "OVER_PROD";
}

const BUCKET_PRIORITY = {
  URGENT: 4,
  MEDIUM: 3,
  LOW: 2,
  OVER_PROD: 1
};

/* ===============================
   SKU LEVEL BUY BUCKET
================================ */

export function calculateSkuBuyBucket() {
  const skuPendancy = calculateSkuPendancy();
  const result = {};

  Object.keys(skuPendancy).forEach(key => {
    const row = skuPendancy[key];
    const bucket = getBucket(row.pendancy);

    result[key] = {
      styleId: row.styleId,
      size: row.size,
      pendancy: row.pendancy,
      bucket
    };
  });

  return result;
}

/* ===============================
   STYLE LEVEL BUY BUCKET
================================ */

export function calculateStyleBuyBucket() {
  const skuBuckets = calculateSkuBuyBucket();
  const result = {};

  Object.values(skuBuckets).forEach(row => {
    const styleId = row.styleId;

    if (!result[styleId]) {
      result[styleId] = {
        styleId,
        bucket: row.bucket,
        bucketPriority: BUCKET_PRIORITY[row.bucket]
      };
    } else {
      const currentPriority = result[styleId].bucketPriority;
      const newPriority = BUCKET_PRIORITY[row.bucket];

      if (newPriority > currentPriority) {
        result[styleId].bucket = row.bucket;
        result[styleId].bucketPriority = newPriority;
      }
    }
  });

  // Remove helper priority before returning
  Object.values(result).forEach(r => {
    delete r.bucketPriority;
  });

  return result;
}
