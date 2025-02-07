import { createSlice } from "@reduxjs/toolkit";

const initialState = {};

const pageLimitsSlice = createSlice({
  name: "pageLimits",
  initialState,
  reducers: {
    setPageLimit(state, action) {
      console.log(" setPageLimit", action.payload);
      const { pageId, limit } = action.payload;
      state[pageId] = limit;
    },
    setFilters(state, action) {
      console.log("setFilters", action.payload, state);
      const { pageId, filters } = action.payload;
      state[`${pageId}_filters`] = filters;
    },

    setSortBy(state, action) {
      console.log("setSortBy", action.payload, state);
      const { pageId, sortBy } = action.payload;
      state[`${pageId}_sortBy`] = sortBy;
    },
  },
});

export const { setPageLimit } = pageLimitsSlice.actions;
export default pageLimitsSlice.reducer;
