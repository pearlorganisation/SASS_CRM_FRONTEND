// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { errorToast, successToast } from "../../utils/extra";
import {
  changeAssignment,
  fetchReAssignments,
  handleReAssigmentRequest,
} from "../actions/reAssign";

const initialState = {
  isLoading: false,
  isSuccess: false,
  totalPages: 1,
  errorMessage: "",
  reAssignData: [],
};

// ---------------------------------------------------------------------------------------

export const reAssignSlice = createSlice({
  name: "assign",
  initialState,
  reducers: {
    resetAssign: (state) => {
      state.isSuccess = false;
    },
    resetAssignedData: (state) => {
      state.reAssignData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReAssignments.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(fetchReAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reAssignData = action.payload?.result || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(fetchReAssignments.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(handleReAssigmentRequest.pending, (state, action) => {
        state.isSuccess = false;
      })
      .addCase(handleReAssigmentRequest.fulfilled, (state, action) => {
        state.isSuccess = true;
        successToast("Re-assignment request handled successfully");
      })
      .addCase(handleReAssigmentRequest.rejected, (state, action) => {
        errorToast(action?.payload);
      })
      .addCase(changeAssignment.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(changeAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Re-assignment successfully");
      })
      .addCase(changeAssignment.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { resetReAssignData } = reAssignSlice.actions;
export default reAssignSlice.reducer;

// ================================================== THE END ==================================================