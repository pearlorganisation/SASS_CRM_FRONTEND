import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//add user Activity
export const addUserActivity = createAsyncThunk(
  "userActivity/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/user-activities`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get user Activity
export const getUserActivity = createAsyncThunk(
  "userActivity/fetch",
  async ({ id, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/user-activities/${id}`, {
        params: { page, limit },
      });
      console.log(response.data);
      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
