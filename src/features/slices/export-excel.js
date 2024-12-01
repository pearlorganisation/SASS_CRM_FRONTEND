import { createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";
import { errorToast } from "../../utils/extra";
import { exportClientExcel } from "../actions/export-excel";
// -------------------------------------------------------------------------------------------

const initialState = {
  isLoading: false,
  errorMessage: "",
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
        state.errorMessage = "";
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
        state.errorMessage = action.payload;
        errorToast(action.payload);
      });
  },
});

// ===========================================Exports==================================================
export default exportSlice.reducer;
export const {} = exportSlice.actions;
