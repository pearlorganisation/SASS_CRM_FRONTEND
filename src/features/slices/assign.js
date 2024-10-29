// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";
import { addAssign , addNote, getNotes} from "../actions/assign";



const initialState = {
  isLoading: false,
  isFormLoading:false,
  assignData: [],
  noteData: [],
  totalPages: null,
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const assignSlice = createSlice({
  name: "assign",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAssign.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(addAssign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.assignData = action.payload.data;
        toast.info(action.payload.data.message, {
          position: "top-center",
        });
      })
      .addCase(addAssign.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong");
      })
      .addCase(addNote.pending, (state, action) => {
        state.isFormLoading = true;
        state.errorMessage = "";
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.isFormLoading = false;
        state.errorMessage = "";
        toast.success("Note Added Successfully", {
          position: "top-center",
        });
      })
      .addCase(addNote.rejected, (state, action) => {
        state.isFormLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong");
      })
      .addCase(getNotes.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getNotes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.noteData = action.payload;
        
      })
      .addCase(getNotes.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong");
      })
     
 
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = assignSlice.actions;
export default assignSlice.reducer;

// ================================================== THE END ==================================================
