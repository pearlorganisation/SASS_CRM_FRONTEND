// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { addUserActivity, getUserActivity } from "../actions/userActivity.js";

const initialState = {
  isLoading: false,
  userActivities: [],
  totalPages: 1,
  errorMessage: "",
  isEmployee: false,
};

// ---------------------------------------------------------------------------------------

export const userActivitySlice = createSlice({
  name: "userActivity",
  initialState,
  reducers: {
    resetUserActivities: (state) => {
      state.userActivities = [];
    },
    setIsEmployee: (state, action) => {
      state.isEmployee = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUserActivity.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(addUserActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
      })
      .addCase(addUserActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      })
      .addCase(getUserActivity.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getUserActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.userActivities = action.payload?.data || [];
        state.totalPages = action.payload?.pagination?.totalPages || 1;
      })
      .addCase(getUserActivity.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { resetUserActivities ,setIsEmployee } = userActivitySlice.actions;
export default userActivitySlice.reducer;

// ================================================== THE END ==================================================
