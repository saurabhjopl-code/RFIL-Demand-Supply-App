/*****************************************************************
 * GLOBAL APP STATE – LOCKED
 *****************************************************************/

export const AppState = {
  /* ===============================
     RAW DATA (CSV LOAD)
  ================================ */
  rawData: {
    sales: [],
    stock: [],
    styleStatus: [],
    saleDays: [],
    sizeCount: [],
    production: []
  },

  /* ===============================
     FILTERED DATA
  ================================ */
  filteredData: {
    sales: []
  },

  /* ===============================
     FILTER VALUES (NO MONTH)
  ================================ */
  filters: {
    fc: "All FC",
    category: "All Categories",
    remark: "All Company Remarks",
    search: ""
  },

  /* ===============================
     LOAD PROGRESS
  ================================ */
  loadProgress: {
    total: 6,
    completed: 0
  }
};
