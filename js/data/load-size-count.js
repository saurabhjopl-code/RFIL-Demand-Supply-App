import { AppState } from "../core/state.js";
import { DATA_SOURCES } from "../core/constants.js";
import { parseCSV } from "../core/utils.js";

export async function loadSizeCount() {
  const res = await fetch(DATA_SOURCES.sizeCount);
  const text = await res.text();
  AppState.rawData.sizeCount = parseCSV(text);
}
