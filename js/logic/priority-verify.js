/*****************************************************************
 * PRIORITY RANK VERIFICATION
 * ---------------------------------------------------------------
 * Console-only validation
 *****************************************************************/

import { calculateStylePriorityRanking } from "./priority-engine.js";

export function verifyPriorityRanking() {
  const rankedStyles = calculateStylePriorityRanking();

  console.group("🏁 PRIORITY RANKING VERIFICATION");

  console.table(
    rankedStyles.slice(0, 15)
  );

  console.groupEnd();
}
