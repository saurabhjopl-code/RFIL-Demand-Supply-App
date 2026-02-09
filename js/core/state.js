export const AppState = {
  rawData: {
    sales: [],
    stock: [],
    styleStatus: [],
    saleDays: [],
    sizeCount: [],
    production: []
  },

  filters: {
    month: "Latest Month",
    fc: "All FC",
    category: "All Categories",
    remark: "All Company Remarks",
    search: ""
  },

  filteredData: {
    sales: []
  },

  loadProgress: {
    total: 6,
    completed: 0
  }
};
