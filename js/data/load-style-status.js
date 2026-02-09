import { AppState } from "../core/state.js";
import { DATA_SOURCES } from "../core/constants.js";
import { parseCSV } from "../core/utils.js";

export async function loadStyleStatus() {
  const res = await fetch(DATA_SOURCES.styleStatus);
  const text = await res.text();
  AppState.rawData.styleStatus = parseCSV(text);
}
