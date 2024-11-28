import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

// get employee data
export const getAllClients = createAsyncThunk(
  "clients/fetchData",
  async (params, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/users/clients`,{params});

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

export const updateClient = createAsyncThunk(
  "client/update",
  async ({data, id}, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/users/clients/${id}`, data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);