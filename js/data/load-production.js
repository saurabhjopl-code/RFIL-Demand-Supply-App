import { AppState } from "../core/state.js";
import { DATA_SOURCES } from "../core/constants.js";
import { parseCSV } from "../core/utils.js";

export async function loadProduction() {
  const res = await fetch(DATA_SOURCES.production);
  const text = await res.text();
  AppState.rawData.production = parseCSV(text);
}
