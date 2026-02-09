/*****************************************************************
 * DEMAND REPORT – FINAL (TABLE UI MATCHED)
 * ---------------------------------------------------------------
 * - Center aligned table
 * - Sales sorted high → low
 * - Native HTML table
 * - Expand / collapse supported
 *****************************************************************/

import { calculateStyleDRR, calculateSkuDRR } from "../logic/drr-engine.js";
import { calculateStyleSC, calculateSkuSC } from "../logic/sc-engine.js";
import { calculateStyleDirectDemand, calculateSkuDirectDemand } from "../logic/direct-demand-engine.js";
import { calculateStylePendancy, calculateSkuPendancy } from "../logic/pendency-engine.js";
import { calculateStyleBuyBucket, calculateSkuBuyBucket } from "../logic/buy-bucket-engine.js";
import { calculateStylePriorityRanking } from "../logic/priority-engine.js";
import { calculateStyleStock, calculateSkuStock } from "../logic/stock-engine.js";

export function renderDemandReport() {
  const panel = document.getElementById("demandReport");
  if (!panel) return;

  panel.innerHTML = "";

  /* ===============================
     TABLE SETUP
  ================================ */

  const table = document.createElement("table");
  table.style.width = "100%";
  table.style.margin = "0 auto";
  table.style.borderCollapse = "collapse";
  table.style.textAlign = "center";

  table.innerHTML = `
    <thead>
      <tr>
        <th></th>
        <th>Style / Size</th>
        <th>Sales</th>
        <th>Seller Stock</th>
        <th>FC Stock</th>
        <th>DRR</th>
        <th>SC</th>
        <th>Direct Demand</th>
        <th>In Production</th>
        <th>Pendancy</th>
        <th>Buy Bucket</th>
        <th>Priority</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  /* ===============================
     LOAD LOGIC
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

  const priorityMap = {};
  calculateStylePriorityRanking().forEach(
    r => (priorityMap[r.styleId] = r.priorityRank)
  );

  /* ===============================
     BUILD STYLE DATA
  ================================ */

  const styles = [];

  Object.keys(styleDRR).forEach(styleId => {
    styles.push({
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
    });
  });

  Object.keys(skuDRR).forEach(key => {
    const sku = skuDRR[key];
    const style = styles.find(s => s.styleId === sku.styleId);
    if (!style) return;

    const stock = skuStock[key] || {};
    const pend = skuPend[key] || {};

    if (
      (sku.units || 0) === 0 &&
      (stock.sellerStock || 0) === 0 &&
      (pend.pendancy || 0) === 0
    ) return;

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
     SORT: SALES HIGH → LOW
  ================================ */

  styles.sort((a, b) => b.sales - a.sales);

  /* ===============================
     RENDER TABLE
  ================================ */

  styles.forEach(style => {
    const styleRow = document.createElement("tr");
    styleRow.innerHTML = `
      <td class="toggle" style="cursor:pointer">+</td>
      <td><strong>${style.styleId}</strong></td>
      <td>${style.sales}</td>
      <td>${style.sellerStock}</td>
      <td>${style.fcStock}</td>
      <td>${style.drr.toFixed(2)}</td>
      <td>${style.sc.toFixed(1)}</td>
      <td>${style.directDemand}</td>
      <td>${style.inProduction}</td>
      <td>${style.pendancy}</td>
      <td>${style.buyBucket}</td>
      <td>${style.priority}</td>
    `;
    tbody.appendChild(styleRow);

    style.skus.forEach(sku => {
      const skuRow = document.createElement("tr");
      skuRow.className = "sku-row";
      skuRow.style.display = "none";
      skuRow.innerHTML = `
        <td></td>
        <td>Size ${sku.size}</td>
        <td>${sku.sales}</td>
        <td>${sku.sellerStock}</td>
        <td>${sku.fcStock}</td>
        <td>${sku.drr.toFixed(2)}</td>
        <td>${sku.sc.toFixed(1)}</td>
        <td>${sku.directDemand}</td>
        <td>${sku.inProduction}</td>
        <td>${sku.pendancy}</td>
        <td>${sku.buyBucket}</td>
        <td></td>
      `;
      tbody.appendChild(skuRow);
    });

    styleRow.addEventListener("click", () => {
      let next = styleRow.nextSibling;
      const open = next && next.style.display !== "none";

      styleRow.querySelector(".toggle").textContent = open ? "+" : "−";

      while (next && next.classList.contains("sku-row")) {
        next.style.display = open ? "none" : "table-row";
        next = next.nextSibling;
      }
    });
  });

  panel.appendChild(table);
}
