import { AppState } from "../core/state.js";
import { DATA_SOURCES } from "../core/constants.js";
import { parseCSV } from "../core/utils.js";

export async function loadSales() {
  const res = await fetch(DATA_SOURCES.sales);
  const text = await res.text();
  AppState.rawData.sales = parseCSV(text);
}
