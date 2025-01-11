// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import { getPabblyToken, getUserNotifications, resetUnseenCount } from "../actions/notification";

const initialState = {
  isLoading: false,
  errorMessage: "",
  isSuccess: false,
  notifications: [],
  totalPages: 1,
  unseenCount: 0,
};

// ---------------------------------------------------------------------------------------

export const notificationSlice = createSlice({
  name: "globalData",
  initialState,
  reducers: {
    newNotification(state, action) {
      state.notifications = [action.payload,...state.notifications];
      state.unseenCount = state.unseenCount + 1;
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
        state.unseenCount = action.payload.unseenCount || 0;
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(resetUnseenCount.pending, (state, action) => {
        state.unseenCount = 0
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { newNotification} = notificationSlice.actions;
export default notificationSlice.reducer;

// ================================================== THE END ==================================================
