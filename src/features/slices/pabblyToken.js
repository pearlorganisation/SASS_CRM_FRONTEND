// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import { getPabblyToken, getUserNotifications } from "../actions/pabblyToken";

const initialState = {
  isLoading: false,
  pabblyTokenData: [],
  errorMessage: "",
  isSuccess: false,
  notifications: [],
  totalPages: 1,
  unSeenCount: 0,
};

// ---------------------------------------------------------------------------------------

export const globalDataSlice = createSlice({
  name: "globalData",
  initialState,
  reducers: {
    incrementUnseenCount(state, action) {
      state.unSeenCount = state.unSeenCount + (action.payload || 0);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPabblyToken.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getPabblyToken.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.pabblyTokenData = action.payload.data;
      })
      .addCase(getPabblyToken.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(getUserNotifications.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getUserNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications || [];
        state.totalPages = action.payload.totalPages || 1;
        state.unSeenCount = action.payload.unSeenCount || 0;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.isLoading = false;
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = globalDataSlice.actions;
export default globalDataSlice.reducer;

// ================================================== THE END ==================================================
