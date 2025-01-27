import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";
import { successToast } from "../../utils/extra";

//add product
export const addProduct = createAsyncThunk(
  "products/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/products`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//add product
export const updateProduct = createAsyncThunk(
  "products/update",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`/products/${payload.id}`, payload);
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
      const { data } = await instance.get(`/products`, {
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
      const { data } = await instance.get(`/products/all`);
      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

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


export const deleteProduct = createAsyncThunk(
  "attendeeProduct/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`products/${id}`);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }

    
  }
  
);

