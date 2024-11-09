import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//add Price Plans
export const addPricePlans = createAsyncThunk(
  "addPricePlans",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`plans`, payload, {
        withCredentials: true,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get Price Plans
export const getPricePlans = createAsyncThunk(
  "getPricePlans",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(`plans`, {
        withCredentials: true,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//update Price Plans
export const updatePricePlans = createAsyncThunk(
  "updatePricePlans",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`plans/${payload?._id}`, payload, {
        withCredentials: true,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//update Price Plans
export const deletePricePlan = createAsyncThunk(
  "deletePricePlan",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`plans/${payload?._id}`, payload, {
        withCredentials: true,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
