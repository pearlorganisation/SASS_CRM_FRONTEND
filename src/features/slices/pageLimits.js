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
  },
});

export const { setPageLimit } = pageLimitsSlice.actions;
export default pageLimitsSlice.reducer;
