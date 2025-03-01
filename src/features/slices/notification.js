// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import {
  getPabblyToken,
  getUserNotifications,
  resetUnseenCount,
} from "../actions/notification";
import { NotifActionType } from "../../utils/extra";

const initialState = {
  isLoading: false,
  errorMessage: "",
  isSuccess: false,
  notifications: [],
  totalPages: 1,
  unseenCount: 0,
  _notifications: [],
  _totalPages: 1,
  _unseenCount: 0,
};

// ---------------------------------------------------------------------------------------

export const notificationSlice = createSlice({
  name: "globalData",
  initialState,
  reducers: {
    newNotification(state, action) {
      if (
        [
          NotifActionType.ATTENDEE_REGISTRATION,
          NotifActionType.ASSIGNMENT,
        ].includes(action.payload?.actionType)
      ) {
        state._notifications = [action.payload, ...state._notifications];
        state._unseenCount = state._unseenCount + 1;
      } else {
        state.notifications = [action.payload, ...state.notifications];
        state.unseenCount = state.unseenCount + 1;
      }
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
        const { data, important } = action.payload;
        if (important) {
          state.notifications = data.notifications || [];
          state.totalPages = data.totalPages || 1;
          state.unseenCount = data.unseenCount || 0;
        } else {
          state._notifications = data.notifications || [];
          state._totalPages = data.totalPages || 1;
          state._unseenCount = data.unseenCount || 0;
        }
      })
      .addCase(getUserNotifications.rejected, (state, action) => {
        state.isLoading = false;
      })
      .addCase(resetUnseenCount.fulfilled, (state, action) => {
        if (action.payload.important) {
          state.unseenCount = 0;
        } else {
          state._unseenCount = 0;
        }
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { newNotification } = notificationSlice.actions;
export default notificationSlice.reducer;

// ================================================== THE END ==================================================
