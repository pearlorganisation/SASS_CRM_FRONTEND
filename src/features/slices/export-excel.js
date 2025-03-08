import { createSlice } from "@reduxjs/toolkit";
import { errorToast, successToast } from "../../utils/extra";
import {
  deleteUserDocument,
  exportClientExcel,
  exportEmployeesExcel,
  exportWebinarAttendeesExcel,
  exportWebinarExcel,
  getUserDocument,
  getUserDocuments,
} from "../actions/export-excel";
// -------------------------------------------------------------------------------------------

const initialState = {
  isLoading: false,
  isSuccess: false,
  isExportLoading: false,
  userDocuments: [],
  userDocumentsForPage: [],
  pagination: {},
};

// -------------------------------------- Slices------------------------------------------------
const exportSlice = createSlice({
  name: "export",
  initialState,
  reducers: {
    resetExportSuccess: (state) => {
      state.isSuccess = false;
    },
    setNewDownload: (state, action) => {
      state.userDocuments = [action.payload, ...state.userDocuments];
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
        state.isExportLoading = true;
      })
      .addCase(exportWebinarExcel.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.isExportLoading = false;
        successToast(`Data Exported Successfully`);
      })
      .addCase(exportWebinarExcel.rejected, (state, action) => {
        state.isLoading = false;
        state.isExportLoading = false;
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
      })
      .addCase(getUserDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, pagination, bell } = action.payload || {};
        if (bell) {
          state.userDocuments = data || [];
        } else {
          state.userDocumentsForPage = data || [];
          state.pagination = pagination || {};
        }
      })
      .addCase(getUserDocuments.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      })
      .addCase(getUserDocument.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getUserDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(getUserDocument.rejected, (state, action) => {
        console.log(action)
        state.isLoading = false;
        errorToast(action.payload);
      })
      .addCase(deleteUserDocument.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(deleteUserDocument.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        const {id} = action.payload;
        state.userDocuments = state.userDocuments.filter((doc) => doc._id !== id)
      })
      .addCase(deleteUserDocument.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      })
  },
});

// ===========================================Exports==================================================
export default exportSlice.reducer;
export const { resetExportSuccess, setNewDownload } = exportSlice.actions;
