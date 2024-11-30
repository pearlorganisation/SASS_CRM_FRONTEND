import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//assign  attendee
export const createGlobalData = createAsyncThunk(
  "createGlobalData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`landingpage`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getGlobalData = createAsyncThunk(
  "getGlobalData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`landingpage`);
      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//assign  attendee
export const createCustomOption = createAsyncThunk(
  "customOption/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`customOptions`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getCustomOptions = createAsyncThunk(
  "customOption/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`customOptions`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const deleteCustomOption = createAsyncThunk(
  "customOption/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`customOptions/${id}`);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getDashboardCardsData = createAsyncThunk(
  "Dashboard/fetchData",
  async (params, { rejectWithValue }) => {
    try {
      const response = await instance.get(`dashboard/superAdmin`, { params });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getDashboardPlansData = createAsyncThunk(
  "DashboardPlans/fetchData",
  async (params, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/dashboard/plans`, { params });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getDashboardUsersData = createAsyncThunk(
  "DashboardUsers/fetchData",
  async (params, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/dashboard/users`, { params });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getDashboardRevenueData = createAsyncThunk(
  "DashboardRevenue/fetchData",
  async (params, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/dashboard/revenue`, { params });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
