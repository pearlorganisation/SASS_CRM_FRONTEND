import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//add employee
export const addEmployee = createAsyncThunk(
  "addEmployee",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`auth/createEmployee`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get employee data
export const getAllEmployees = createAsyncThunk(
  "getAllEmployees",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/employee?adminId=${id}`);

      return data?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// toggle employee Status
export const changeEmployeeStatus = createAsyncThunk(
  "employee/toggleStatus",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await instance.patch(`/employee/${id}`);

      return data?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get employee data
export const getAllClients = createAsyncThunk(
  "clients/fetchData",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/users/clients`);

      return data?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get employee assignments data
export const getEmployeeAssignments = createAsyncThunk(
  "employeeAssignments/fetchData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/attendee/employee/assignments?employeeId=${id}`
      );
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);


// get employee Statistics
export const getEmployeeStats = createAsyncThunk(
  "employeeStats/fetchData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/users/employeeStats`
      );
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);