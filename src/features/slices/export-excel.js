import { createSlice } from "@reduxjs/toolkit";
import { errorToast, successToast } from "../../utils/extra";
import {
  exportClientExcel,
  exportEmployeesExcel,
  exportWebinarAttendeesExcel,
  exportWebinarExcel,
} from "../actions/export-excel";
// -------------------------------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isSuccess: false,
};

// -------------------------------------- Slices------------------------------------------------
const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // signUp lifecycle methods
      .addCase(exportClientExcel.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(exportClientExcel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast(`Data Exported Successfully`);
      })
      .addCase(exportClientExcel.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      })
      .addCase(exportWebinarAttendeesExcel.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(exportWebinarAttendeesExcel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast(`Data Exported Successfully`);
      })
      .addCase(exportWebinarAttendeesExcel.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      })
      .addCase(exportWebinarExcel.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(exportWebinarExcel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast(`Data Exported Successfully`);
      })
      .addCase(exportWebinarExcel.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      })
      .addCase(exportEmployeesExcel.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(exportEmployeesExcel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast(`Data Exported Successfully`);
      })
      .addCase(exportEmployeesExcel.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      });
  },
});

// ===========================================Exports==================================================
export default exportSlice.reducer;
export const {} = exportSlice.actions;
