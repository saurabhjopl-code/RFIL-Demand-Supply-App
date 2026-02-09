/*****************************************************************
 * APP STATE – FINAL (EXPOSED SAFELY)
 *****************************************************************/

export const AppState = {
  rawData: {
    sales: [],
    stock: [],
    styleStatus: [],
    saleDays: [],
    sizeCount: [],
    production: []
  },

  filteredData: {
    sales: []
  },

  filters: {
    fc: "All FC",
    category: "All Categories",
    remark: "All Company Remarks",
    search: ""
  }
};

// 🔒 EXPOSE FOR DEBUGGING & SANITY CHECKS
window.AppState = AppState;
