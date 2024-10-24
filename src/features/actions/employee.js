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
      const {data} = await instance.get(`/employee?adminId=${id}`);

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
      const {data} = await instance.get(`/users/clients`);

      return data?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);



