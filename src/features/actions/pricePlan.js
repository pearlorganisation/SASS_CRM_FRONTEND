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

//get Price Plans
export const getPricePlan = createAsyncThunk(
  "pricePlan/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.get(`plans/${id}`, {
        withCredentials: true,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//create AddOn
export const createAddon = createAsyncThunk(
  "addon/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`addon`, payload);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get AddOn
export const getAddons = createAsyncThunk(
  "addon/fetchData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(`addon`, payload);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get AddOn
export const getClientAddons = createAsyncThunk(
  "clinetAddons/fetchData",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.get(`addon/client/${id}`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
