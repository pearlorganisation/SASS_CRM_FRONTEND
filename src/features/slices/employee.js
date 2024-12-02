// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";

import {
  addEmployee,
  getAllEmployees,
  getEmployeeAssignments,
  changeEmployeeStatus,
  getEmployeeStats,
} from "../actions/employee";
import { errorToast, successToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  isSuccess: false,
  employeeData: [],
  totalPages: null,
  errorMessage: "",
  employeeAssignments: [],
  Stats: null,
};

// ---------------------------------------------------------------------------------------

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearSuccess(state) {
      state.isSuccess = false;
    }
  },
  extraReducers: (builder) => {
    builder

      .addCase(addEmployee.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
        state.errorMessage = "";
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.isSuccess = true;
        successToast("Employee Added Successfully");
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(getAllEmployees.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.employeeData = action.payload;
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(changeEmployeeStatus.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(changeEmployeeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.employeeData = action.payload;
      })
      .addCase(changeEmployeeStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(getEmployeeAssignments.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getEmployeeAssignments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.employeeAssignments = action.payload.data;
      })
      .addCase(getEmployeeAssignments.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })

      .addCase(getEmployeeStats.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getEmployeeStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.Stats = action.payload;
      })
      .addCase(getEmployeeStats.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
      });
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { clearSuccess} = employeeSlice.actions;
export default employeeSlice.reducer;

// ================================================== THE END ==================================================
