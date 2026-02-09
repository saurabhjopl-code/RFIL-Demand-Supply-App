import { AppState } from "../core/state.js";
import { DATA_SOURCES } from "../core/constants.js";
import { parseCSV } from "../core/utils.js";

export async function loadStock() {
  const res = await fetch(DATA_SOURCES.stock);
  const text = await res.text();
  AppState.rawData.stock = parseCSV(text);
}
