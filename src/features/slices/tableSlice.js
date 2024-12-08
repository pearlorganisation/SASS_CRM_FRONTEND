import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRows: [],
  filters: {},
  page: 1,
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
  },
});

export const { setSelectedRows, setFilters, setPage } = tableSlice.actions;
export default tableSlice.reducer;
