// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";

import { toast } from "sonner";

import { addEmployee, getAllEmployees, getAllClients } from "../actions/employee";

const initialState = {
  isLoading: false,
  employeeData: [],
  totalPages: null,
  errorMessage: "",
  clientsData: []
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
 
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const {} = employeeSlice.actions;
export default employeeSlice.reducer;

// ================================================== THE END ==================================================
