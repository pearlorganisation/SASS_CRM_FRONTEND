// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import {
  addAssign,
  addLeadType,
  addNote,
  deleteLeadType,
  getAssignments,
  getAssignmentsActivity,
  getDashboardNotes,
  getLeadType,
  getNotes,
  updateLeadType,
} from "../actions/assign";
import { errorToast, successToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isFormLoading: false,
  assignData: [],
  leadTypeData: [],
  dashboardNotes: [],
  noteData: [],
  totalPages: 1,
  errorMessage: "",
  activityAssignMents: [],
};

// ---------------------------------------------------------------------------------------

export const assignSlice = createSlice({
  name: "assign",
  initialState,
  reducers: {
    resetAssign: (state) => {
      state.isSuccess = false;
    },
    resetAssignedData: (state) => {
      state.assignData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addAssign.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(addAssign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Assignment Created Successfully");
        
      })
      .addCase(addAssign.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(addNote.pending, (state, action) => {
        state.isFormLoading = true;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.isFormLoading = false;
        toast.success("Note Added Successfully", {
          position: "top-center",
        });
      })
      .addCase(addNote.rejected, (state, action) => {
        errorToast(action?.payload);
      })
      .addCase(getNotes.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.noteData = action.payload?.data || [];
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(getAssignments.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.assignData = action.payload?.result || [];
        state.totalPages = action.payload?.totalPages || 1;
      })
      .addCase(getAssignments.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(addLeadType.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(addLeadType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(addLeadType.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getLeadType.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getLeadType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.leadTypeData = action.payload || [];
      })
      .addCase(getLeadType.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(updateLeadType.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateLeadType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(updateLeadType.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(deleteLeadType.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteLeadType.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(deleteLeadType.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getDashboardNotes.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getDashboardNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.dashboardNotes = action.payload || [];
      })
      .addCase(getDashboardNotes.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getAssignmentsActivity.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAssignmentsActivity.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activityAssignMents = action.payload || [];
      })
      .addCase(getAssignmentsActivity.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      });
    // .addDefaultCase((state, action) => {
    //   return state;
    // });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {resetAssignedData, } = assignSlice.actions;
export default assignSlice.reducer;

// ================================================== THE END ==================================================
