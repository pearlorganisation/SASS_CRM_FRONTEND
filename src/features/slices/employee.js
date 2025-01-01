// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import {
  addEmployee,
  getAllEmployees,
  getEmployeeAssignments,
  changeEmployeeStatus,
  getEmployeeStats,
  getEmployee,
  updateEmployee,
  updateEmployeeStatus,
} from "../actions/employee";
import { errorToast, successToast } from "../../utils/extra";

const initialState = {
  isLoading: false,
  isSuccess: false,
  employeeData: [],
  singleEmployeeData: null,
  totalPages: 1,
  errorMessage: "",
  employeeAssignments: [],
  Stats: null,
  employeeModeId: null,
};

// ---------------------------------------------------------------------------------------

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {
    clearSuccess(state) {
      state.isSuccess = false;
    },

    setEmployeeModeId(state, action) {
      state.employeeModeId = action.payload ? action.payload : null;
    },
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
      .addCase(updateEmployee.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Employee Updated Successfully");
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(updateEmployeeStatus.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(updateEmployeeStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        successToast("Employee Status Updated Successfully");
      })
      .addCase(updateEmployeeStatus.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getAllEmployees.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAllEmployees.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.employeeData = action.payload?.result || [];
        state.totalPages = action.payload?.totalPages;
      })
      .addCase(getAllEmployees.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        errorToast(action?.payload);
      })
      .addCase(getEmployee.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.singleEmployeeData = action.payload;
      })
      .addCase(getEmployee.rejected, (state, action) => {
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
export const { clearSuccess, setEmployeeModeId } = employeeSlice.actions;
export default employeeSlice.reducer;

// ================================================== THE END ==================================================
