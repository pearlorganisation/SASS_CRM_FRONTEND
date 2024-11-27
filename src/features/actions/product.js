import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//add product
export const addProduct = createAsyncThunk(
  "addProduct",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/product`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get product data
export const getAllProducts = createAsyncThunk(
  "getAllProducts",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/product`, {
        params: { page, limit },
      });

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get attendees product data
export const getAllProductsByAdminId = createAsyncThunk(
  "attendeeProductsByAdminId/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/product/all`);
      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get product data
export const createAttendeeProduct = createAsyncThunk(
  "attendeeProduct/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`attendeeProduct`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
