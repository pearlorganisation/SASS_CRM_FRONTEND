import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRows: [],
  filters: {},
  page: 1,
  isTablesMasked: false,
};

const tableSlice = createSlice({
  name: "table",
  initialState,
  reducers: {
    setSelectedRows: (state, action) => {
      const prev = state.selectedRows;
      const id = action.payload;
      state.selectedRows = prev.includes(id)
        ? prev.filter((rowId) => rowId !== id)
        : [...prev, id];
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setTableMasked: (state, action) => {
      state.isTablesMasked = action.payload;
    }
    // addMaskedTable: (state, action) => {
    //   const { tableId, tableData } = action.payload;
    //   state.maskedTables.set(tableId, tableData);
    // },
  },
});

export const { setSelectedRows, setFilters, setPage, setTableMasked } = tableSlice.actions;
export default tableSlice.reducer;