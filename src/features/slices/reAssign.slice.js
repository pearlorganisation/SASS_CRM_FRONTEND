// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { errorToast, successToast } from "../../utils/extra";
import {
  changeAssignment,
  fetchPullbackRequestCounts,
  fetchReAssignments,
  handleReAssigmentRequest,
  moveAttendeesToPullbacks,
} from "../actions/reAssign";

const initialState = {
  isLoading: false,
  isSuccess: false,
  totalPages: 1,
  errorMessage: "",
  reAssignData: [],
  reAssignCounts: {},
  requestLoading: false,
};

// ---------------------------------------------------------------------------------------

export const reAssignSlice = createSlice({
  name: "assign",
  initialState,
  reducers: {
    resetReAssignSuccess: (state) => {
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
      .addCase(fetchPullbackRequestCounts.fulfilled, (state, action) => {
        state.reAssignCounts = action.payload || {};
      })
      .addCase(fetchPullbackRequestCounts.rejected, (state, action) => {
        errorToast(action?.payload);
      })
      .addCase(handleReAssigmentRequest.pending, (state, action) => {
        state.isSuccess = false;
        state.requestLoading = true;
      })
      .addCase(handleReAssigmentRequest.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.requestLoading = false;

        const { status } = action?.payload || {};
        let { requests = 0, pullbacks = 0 } = state.reAssignCounts || {};

        if (status === "approved") {
          requests = Math.max(0, requests - 1); 
          pullbacks += 1;
        } else if (status === "rejected") {
          requests = Math.max(0, requests - 1); 
        } else {
          console.warn(`Unexpected status: ${status}`); 
        }

        state.reAssignCounts = { requests, pullbacks };

        if (status === "approved" || status === "rejected") {
          successToast("Re-assignment request handled successfully");
        } else {
          successToast("Request handled, but status was unexpected");
        }
      })
      .addCase(handleReAssigmentRequest.rejected, (state, action) => {
        errorToast(action?.payload);
        state.requestLoading = false;
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
      })
      .addCase(moveAttendeesToPullbacks.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(moveAttendeesToPullbacks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast(" Assignment Successful");
      })
      .addCase(moveAttendeesToPullbacks.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { resetReAssignData, resetReAssignSuccess } =
  reAssignSlice.actions;
export default reAssignSlice.reducer;

// ================================================== THE END ==================================================
