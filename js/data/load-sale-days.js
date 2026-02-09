import { AppState } from "../core/state.js";
import { DATA_SOURCES } from "../core/constants.js";
import { parseCSV } from "../core/utils.js";

export async function loadSaleDays() {
  const res = await fetch(DATA_SOURCES.saleDays);
  const text = await res.text();
  AppState.rawData.saleDays = parseCSV(text);
}
