import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//add user Activity
export const addUserActivity = createAsyncThunk(
  "userActivity/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/userActivity`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get user Activity
export const getUserActivity = createAsyncThunk(
  "userActivity/fetch",
  async ({ id, page }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/userActivity/${id}`, {
        params: { page },
      });
      console.log(response.data);
      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
