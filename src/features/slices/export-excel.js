import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { errorToast } from "../../utils/extra";
import { exportClientExcel, exportWebinarAttendeesExcel } from "../actions/export-excel";
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
        toast.success(`Data Exported Successfully`, {
          position: "top-center",
        });
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
        toast.success(`Data Exported Successfully`, {
          position: "top-center",
        });
      })
      .addCase(exportWebinarAttendeesExcel.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action.payload);
      });
  },
});

// ===========================================Exports==================================================
export default exportSlice.reducer;
export const {} = exportSlice.actions;
