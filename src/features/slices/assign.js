// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import { addAssign, addNote, getAssignments, getNotes } from "../actions/assign";
import { errorToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isFormLoading: false,
  assignData: [],
  noteData: [],
  totalPages: 1,
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const assignSlice = createSlice({
  name: "assign",
  initialState,
  reducers: {
    resetAssign: (state) => {
      state.isSuccess = false;
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
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = assignSlice.actions;
export default assignSlice.reducer;

// ================================================== THE END ==================================================