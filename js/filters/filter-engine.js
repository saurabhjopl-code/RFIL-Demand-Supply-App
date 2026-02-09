import { AppState } from "../core/state.js";

export function applyFilters() {
  let data = [...AppState.rawData.sales];

  // SEARCH OVERRIDES EVERYTHING
  if (AppState.filters.search.trim() !== "") {
    const q = AppState.filters.search.toLowerCase();
    AppState.filteredData.sales = data.filter(row =>
      (row["Style ID"] && row["Style ID"].toLowerCase().includes(q)) ||
      (row["MP SKU"] && row["MP SKU"].toLowerCase().includes(q)) ||
      (row["Uniware SKU"] && row["Uniware SKU"].toLowerCase().includes(q))
    );
    return;
  }

  // MONTH
  if (AppState.filters.month !== "Latest Month") {
    data = data.filter(r => r.Month === AppState.filters.month);
  }

  // FC
  if (AppState.filters.fc !== "All FC") {
    data = data.filter(r => r.FC === AppState.filters.fc);
  }

  // CATEGORY
  if (AppState.filters.category !== "All Categories") {
    const allowedStyles = AppState.rawData.styleStatus
      .filter(s => s.Category === AppState.filters.category)
      .map(s => s["Style ID"]);

    data = data.filter(r => allowedStyles.includes(r["Style ID"]));
  }

  // COMPANY REMARK
  if (AppState.filters.remark !== "All Company Remarks") {
    const allowedStyles = AppState.rawData.styleStatus
      .filter(s => s["Company Remark"] === AppState.filters.remark)
      .map(s => s["Style ID"]);

    data = data.filter(r => allowedStyles.includes(r["Style ID"]));
  }

  AppState.filteredData.sales = data;
}
