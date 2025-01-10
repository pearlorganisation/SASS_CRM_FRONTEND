import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const getPabblyToken = createAsyncThunk(
  "getPabblyToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/auth/admin/token`);
      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getUserNotifications = createAsyncThunk(
  "userNotifications/fetchData",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/notification/${id}`);
      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetUnseenCount = createAsyncThunk(
  "userNotifications/Unseen",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await instance.patch(`/notification/unseen`);
      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
