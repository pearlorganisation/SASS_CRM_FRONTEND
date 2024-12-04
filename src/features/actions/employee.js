import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//add employee
export const addEmployee = createAsyncThunk(
  "employee/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`auth/employee`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//add employee
export const updateEmployee = createAsyncThunk(
  "employee/update",
  async ({id,data}, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`users/employee/${id}`, data);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//update employee Status
export const updateEmployeeStatus = createAsyncThunk(
  "employeeStatus/update",
  async ({id,isActive}, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`users/employee/status/${id}`, {isActive});
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get employee data
export const getAllEmployees = createAsyncThunk(
  "employees/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`users/employee`);

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getEmployee = createAsyncThunk(
  "employee/fetchData", 
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`users/employee/${id}`);

      return data;
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
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/users/clients`, { params });

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get employee data
export const getClientById = createAsyncThunk(
  "clientById/fetchData",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/users/clients/${id}`);

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// client signup from super admin panel
export const clientSignup = createAsyncThunk(
  "client/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post("auth/client", payload);
      return response;
    } catch (error) {
      return rejectWithValue(error);
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
      const response = await instance.get(`/users/employeeStats`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
