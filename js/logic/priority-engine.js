/*****************************************************************
 * PRIORITY RANKING ENGINE – FINAL
 * ---------------------------------------------------------------
 * Ranking Order:
 * 1. Higher DRR
 * 2. Lower Stock Cover (SC)
 * 3. Higher Pendancy
 *
 * Output:
 * - Sorted list of styles with priority rank
 *****************************************************************/

import { calculateStyleDRR } from "./drr-engine.js";
import { calculateStyleSC } from "./sc-engine.js";
import { calculateStylePendancy } from "./pendency-engine.js";

/* ===============================
   PRIORITY RANK CALCULATION
================================ */

export function calculateStylePriorityRanking() {
  const styleDRR = calculateStyleDRR();
  const styleSC = calculateStyleSC();
  const stylePendancy = calculateStylePendancy();

  const styles = [];

  Object.keys(styleDRR).forEach(styleId => {
    styles.push({
      styleId,
      drr: styleDRR[styleId]?.drr || 0,
      sc: styleSC[styleId]?.sc || 0,
      pendancy: stylePendancy[styleId]?.pendancy || 0
    });
  });

  styles.sort((a, b) => {
    // 1️⃣ Higher DRR first
    if (b.drr !== a.drr) return b.drr - a.drr;

    // 2️⃣ Lower SC first
    if (a.sc !== b.sc) return a.sc - b.sc;

    // 3️⃣ Higher Pendancy first
    return b.pendancy - a.pendancy;
  });

  // Assign rank
  styles.forEach((s, index) => {
    s.priorityRank = index + 1;
  });

  return styles;
}
