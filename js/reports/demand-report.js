/*****************************************************************
 * DEMAND REPORT – FINAL, ROBUST RENDERER
 * ---------------------------------------------------------------
 * - NO hard-coded container IDs
 * - Renders inside active Demand tab
 * - Style → SKU expand / collapse
 * - NO UI / CSS changes
 *****************************************************************/

import { calculateStyleDRR, calculateSkuDRR } from "../logic/drr-engine.js";
import { calculateStyleSC, calculateSkuSC } from "../logic/sc-engine.js";
import { calculateStyleDirectDemand, calculateSkuDirectDemand } from "../logic/direct-demand-engine.js";
import { calculateStylePendancy, calculateSkuPendancy } from "../logic/pendency-engine.js";
import { calculateStyleBuyBucket, calculateSkuBuyBucket } from "../logic/buy-bucket-engine.js";
import { calculateStylePriorityRanking } from "../logic/priority-engine.js";
import { calculateStyleStock, calculateSkuStock } from "../logic/stock-engine.js";

/* ===============================================================
   FIND ACTIVE DEMAND CONTAINER (SAFE)
=============================================================== */

function getDemandContainer() {
  // 1️⃣ Active report panel (preferred)
  const activePanel = document.querySelector(
    ".report-panel.active, .report-tab-content.active"
  );
  if (activePanel) return activePanel;

  // 2️⃣ Demand tab content fallback
  const demandByData = document.querySelector(
    '[data-report="demand"]'
  );
  if (demandByData) return demandByData;

  // 3️⃣ Last resort: visible section below tabs
  const sections = Array.from(
    document.querySelectorAll("section, div")
  ).filter(el => el.offsetParent !== null);

  return sections[sections.length - 1] || null;
}

/* ===============================================================
   MAIN RENDER
=============================================================== */

export function renderDemandReport() {
  const container = getDemandContainer();
  if (!container) {
    console.warn("Demand report container not found");
    return;
  }

  container.innerHTML = "";

  /* ===============================
     HEADER ROW
  ================================ */

  const header = document.createElement("div");
  header.className = "report-row report-header";
  header.innerHTML = `
    <div></div>
    <div>Style / Size</div>
    <div>Sales</div>
    <div>Seller Stock</div>
    <div>FC Stock</div>
    <div>DRR</div>
    <div>SC</div>
    <div>Direct Demand</div>
    <div>In Production</div>
    <div>Pendancy</div>
    <div>Buy Bucket</div>
    <div>Priority</div>
  `;
  container.appendChild(header);

  /* ===============================
     LOAD LOGIC OUTPUTS
  ================================ */

  const styleDRR = calculateStyleDRR();
  const skuDRR = calculateSkuDRR();
  const styleSC = calculateStyleSC();
  const skuSC = calculateSkuSC();
  const styleDemand = calculateStyleDirectDemand();
  const skuDemand = calculateSkuDirectDemand();
  const stylePend = calculateStylePendancy();
  const skuPend = calculateSkuPendancy();
  const styleBucket = calculateStyleBuyBucket();
  const skuBucket = calculateSkuBuyBucket();
  const styleStock = calculateStyleStock();
  const skuStock = calculateSkuStock();

  const priorityList = calculateStylePriorityRanking();
  const priorityMap = {};
  priorityList.forEach(r => (priorityMap[r.styleId] = r.priorityRank));

  /* ===============================
     BUILD STYLE OBJECT
  ================================ */

  const styles = {};

  Object.keys(styleDRR).forEach(styleId => {
    styles[styleId] = {
      styleId,
      sales: styleDRR[styleId]?.units || 0,
      sellerStock: styleStock[styleId]?.sellerStock || 0,
      fcStock: styleStock[styleId]?.fcStock || 0,
      drr: styleDRR[styleId]?.drr || 0,
      sc: styleSC[styleId]?.sc || 0,
      directDemand: styleDemand[styleId]?.directDemand || 0,
      inProduction: stylePend[styleId]?.inProduction || 0,
      pendancy: stylePend[styleId]?.pendancy || 0,
      buyBucket: styleBucket[styleId]?.bucket || "LOW",
      priority: priorityMap[styleId] || 9999,
      skus: []
    };
  });

  Object.keys(skuDRR).forEach(key => {
    const sku = skuDRR[key];
    const style = styles[sku.styleId];
    if (!style) return;

    const stock = skuStock[key] || {};
    const pend = skuPend[key] || {};

    if (
      (sku.units || 0) === 0 &&
      (stock.sellerStock || 0) === 0 &&
      (pend.pendancy || 0) === 0
    ) {
      return;
    }

    style.skus.push({
      size: sku.size,
      sales: sku.units || 0,
      sellerStock: stock.sellerStock || 0,
      fcStock: stock.fcStock || 0,
      drr: sku.drr || 0,
      sc: skuSC[key]?.sc || 0,
      directDemand: skuDemand[key]?.directDemand || 0,
      inProduction: pend.inProduction || 0,
      pendancy: pend.pendancy || 0,
      buyBucket: skuBucket[key]?.bucket || "LOW"
    });
  });

  /* ===============================
     SORT & RENDER
  ================================ */

  Object.values(styles)
    .sort((a, b) => a.priority - b.priority)
    .forEach(style => {
      const styleRow = document.createElement("div");
      styleRow.className = "report-row style-row";
      styleRow.innerHTML = `
        <div class="toggle">+</div>
        <div>${style.styleId}</div>
        <div>${style.sales}</div>
        <div>${style.sellerStock}</div>
        <div>${style.fcStock}</div>
        <div>${style.drr.toFixed(2)}</div>
        <div>${style.sc.toFixed(1)}</div>
        <div>${style.directDemand}</div>
        <div>${style.inProduction}</div>
        <div>${style.pendancy}</div>
        <div>${style.buyBucket}</div>
        <div>${style.priority}</div>
      `;
      container.appendChild(styleRow);

      const skuWrap = document.createElement("div");
      skuWrap.className = "sku-wrapper hidden";

      style.skus.forEach(sku => {
        const skuRow = document.createElement("div");
        skuRow.className = "report-row sku-row";
        skuRow.innerHTML = `
          <div></div>
          <div>Size ${sku.size}</div>
          <div>${sku.sales}</div>
          <div>${sku.sellerStock}</div>
          <div>${sku.fcStock}</div>
          <div>${sku.drr.toFixed(2)}</div>
          <div>${sku.sc.toFixed(1)}</div>
          <div>${sku.directDemand}</div>
          <div>${sku.inProduction}</div>
          <div>${sku.pendancy}</div>
          <div>${sku.buyBucket}</div>
          <div></div>
        `;
        skuWrap.appendChild(skuRow);
      });

      container.appendChild(skuWrap);
    });

  /* ===============================
     EXPAND / COLLAPSE
  ================================ */

  container.onclick = e => {
    const toggle = e.target.closest(".toggle");
    if (!toggle) return;

    const styleRow = toggle.closest(".style-row");
    const skuWrap = styleRow.nextElementSibling;

    const open = !skuWrap.classList.contains("hidden");
    skuWrap.classList.toggle("hidden", open);
    toggle.textContent = open ? "+" : "−";
  };
}
