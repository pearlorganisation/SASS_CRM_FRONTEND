// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";

import { addEmployee, getAllEmployees, getAllClients, getEmployeeAssignments, changeEmployeeStatus, getEmployeeStats } from "../actions/employee";

const initialState = {
  isLoading: false,
  employeeData: [],
  totalPages: null,
  errorMessage: "",
  clientsData: [],
  employeeAssignments: [],
  Stats: null
};

// ---------------------------------------------------------------------------------------

export const employeeSlice = createSlice({
  name: "employee",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(addEmployee.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.employeeData = action.payload.data;
        toast.success("Employee Added Successfully", {
          position: "top-center",
        });
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong");
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
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
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
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
      })
      .addCase(getAllClients.pending, (state, action) => {
        state.isLoading = true;
        state.errorMessage = "";
      })
      .addCase(getAllClients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.errorMessage = "";
        state.clientsData = action.payload;
      })
      .addCase(getAllClients.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload;
        toast.error(action?.payload || "Something went wrong", {
          position: "top-center",
        });
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
        toast.error(action?.payload || "Something went wrong");
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
       
      })
 
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = employeeSlice.actions;
export default employeeSlice.reducer;

// ================================================== THE END ==================================================
