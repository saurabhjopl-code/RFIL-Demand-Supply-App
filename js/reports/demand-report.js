/*****************************************************************
 * DEMAND REPORT – STYLE → SKU (FINAL)
 * ---------------------------------------------------------------
 * - Single file
 * - No subfolders
 * - No UI changes
 * - Expand / collapse included
 *****************************************************************/

import { calculateStyleDRR, calculateSkuDRR } from "../logic/drr-engine.js";
import { calculateStyleSC, calculateSkuSC } from "../logic/sc-engine.js";
import { calculateStyleDirectDemand, calculateSkuDirectDemand } from "../logic/direct-demand-engine.js";
import { calculateStylePendancy, calculateSkuPendancy } from "../logic/pendency-engine.js";
import { calculateStyleBuyBucket, calculateSkuBuyBucket } from "../logic/buy-bucket-engine.js";
import { calculateStylePriorityRanking } from "../logic/priority-engine.js";
import { calculateStyleStock, calculateSkuStock } from "../logic/stock-engine.js";

/* ===============================================================
   MAIN RENDER FUNCTION
=============================================================== */

export function renderDemandReport() {
  const container = document.getElementById("demandReport");
  if (!container) return;

  container.innerHTML = "";

  /* ---------- LOAD ALL LOGIC OUTPUTS ---------- */

  const styleDRR = calculateStyleDRR();
  const skuDRR = calculateSkuDRR();

  const styleSC = calculateStyleSC();
  const skuSC = calculateSkuSC();

  const styleDemand = calculateStyleDirectDemand();
  const skuDemand = calculateSkuDirectDemand();

  const stylePendancy = calculateStylePendancy();
  const skuPendancy = calculateSkuPendancy();

  const styleBuckets = calculateStyleBuyBucket();
  const skuBuckets = calculateSkuBuyBucket();

  const styleStock = calculateStyleStock();
  const skuStock = calculateSkuStock();

  const priorityList = calculateStylePriorityRanking();
  const priorityMap = {};
  priorityList.forEach(r => {
    priorityMap[r.styleId] = r.priorityRank;
  });

  /* ---------- BUILD STYLE OBJECT ---------- */

  const styles = {};

  Object.keys(styleDRR).forEach(styleId => {
    styles[styleId] = {
      styleId,
      sales: styleDRR[styleId]?.units || 0,
      sellerStock: styleStock[styleId]?.sellerStock || 0,
      fcStock: styleStock[styleId]?.fcStock || 0,
      totalStock: styleStock[styleId]?.totalStock || 0,
      drr: styleDRR[styleId]?.drr || 0,
      sc: styleSC[styleId]?.sc || 0,
      directDemand: styleDemand[styleId]?.directDemand || 0,
      inProduction: stylePendancy[styleId]?.inProduction || 0,
      pendancy: stylePendancy[styleId]?.pendancy || 0,
      buyBucket: styleBuckets[styleId]?.bucket || "LOW",
      priorityRank: priorityMap[styleId] || 9999,
      skus: []
    };
  });

  /* ---------- ATTACH SKU DATA ---------- */

  Object.keys(skuDRR).forEach(key => {
    const sku = skuDRR[key];
    const styleId = sku.styleId;

    if (!styles[styleId]) return;

    const stock = skuStock[key] || {};
    const pend = skuPendancy[key] || {};

    // Skip noise
    if (
      (sku.units || 0) === 0 &&
      (stock.sellerStock || 0) === 0 &&
      (pend.pendancy || 0) === 0
    ) {
      return;
    }

    styles[styleId].skus.push({
      size: sku.size,
      sales: sku.units || 0,
      sellerStock: stock.sellerStock || 0,
      fcStock: stock.fcStock || 0,
      totalStock: stock.totalStock || 0,
      drr: sku.drr || 0,
      sc: skuSC[key]?.sc || 0,
      directDemand: skuDemand[key]?.directDemand || 0,
      inProduction: pend.inProduction || 0,
      pendancy: pend.pendancy || 0,
      buyBucket: skuBuckets[key]?.bucket || "LOW"
    });
  });

  /* ---------- SORT BY PRIORITY ---------- */

  const sortedStyles = Object.values(styles).sort(
    (a, b) => a.priorityRank - b.priorityRank
  );

  /* ---------- RENDER ---------- */

  sortedStyles.forEach(style => {
    const styleRow = document.createElement("div");
    styleRow.className = "demand-style-row";
    styleRow.innerHTML = `
      <div class="cell expand-toggle">+</div>
      <div class="cell">${style.styleId}</div>
      <div class="cell">${style.sales}</div>
      <div class="cell">${style.sellerStock}</div>
      <div class="cell">${style.fcStock}</div>
      <div class="cell">${style.drr.toFixed(2)}</div>
      <div class="cell">${style.sc.toFixed(1)}</div>
      <div class="cell">${style.directDemand}</div>
      <div class="cell">${style.inProduction}</div>
      <div class="cell">${style.pendancy}</div>
      <div class="cell">${style.buyBucket}</div>
      <div class="cell">${style.priorityRank}</div>
    `;

    container.appendChild(styleRow);

    const skuWrapper = document.createElement("div");
    skuWrapper.className = "sku-wrapper hidden";

    style.skus.forEach(sku => {
      const skuRow = document.createElement("div");
      skuRow.className = "demand-sku-row";
      skuRow.innerHTML = `
        <div class="cell"></div>
        <div class="cell">Size ${sku.size}</div>
        <div class="cell">${sku.sales}</div>
        <div class="cell">${sku.sellerStock}</div>
        <div class="cell">${sku.fcStock}</div>
        <div class="cell">${sku.drr.toFixed(2)}</div>
        <div class="cell">${sku.sc.toFixed(1)}</div>
        <div class="cell">${sku.directDemand}</div>
        <div class="cell">${sku.inProduction}</div>
        <div class="cell">${sku.pendancy}</div>
        <div class="cell">${sku.buyBucket}</div>
        <div class="cell"></div>
      `;
      skuWrapper.appendChild(skuRow);
    });

    container.appendChild(skuWrapper);
  });

  /* ---------- EXPAND / COLLAPSE ---------- */

  container.addEventListener("click", e => {
    const toggle = e.target.closest(".expand-toggle");
    if (!toggle) return;

    const styleRow = toggle.closest(".demand-style-row");
    const skuWrapper = styleRow.nextElementSibling;
    if (!skuWrapper) return;

    const isOpen = !skuWrapper.classList.contains("hidden");
    skuWrapper.classList.toggle("hidden", isOpen);
    toggle.textContent = isOpen ? "+" : "−";
  });
}
