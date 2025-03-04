import { createSlice } from "@reduxjs/toolkit";
import { errorToast, successToast } from "../../utils/extra";
import {
  exportClientExcel,
  exportEmployeesExcel,
  exportWebinarAttendeesExcel,
  exportWebinarExcel,
  getUserDocuments,
} from "../actions/export-excel";
// -------------------------------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isSuccess: false,
  isExportLoading: false,
  userDocuments: [],
  pagination: {}
};

// -------------------------------------- Slices------------------------------------------------
const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    resetExportSuccess: (state) => {
      state.isSuccess = false;
    },
  },
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
        state.isExportLoading = true;
      })
      .addCase(exportWebinarAttendeesExcel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isExportLoading = false;
        state.isSuccess = true;
        successToast(`Data Exported Successfully`);
      })
      .addCase(exportWebinarAttendeesExcel.rejected, (state, action) => {
        state.isLoading = false;
        state.isExportLoading = false;
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
      })
      .addCase(getUserDocuments.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getUserDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const { data, pagination } = action.payload || {};
        state.userDocuments = data || [];
        state.pagination = pagination || {};
      })
      .addCase(getUserDocuments.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      });
  },
});

// ===========================================Exports==================================================
export default exportSlice.reducer;
export const {resetExportSuccess} = exportSlice.actions;
