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
  async ({ id, page = 1, limit = 6, important }, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/notification/${id}`, {
        params: { page, limit, important },
      });
      return {
        data,
        important,
      };
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const resetUnseenCount = createAsyncThunk(
  "userNotifications/Unseen",
  async (important, { rejectWithValue }) => {
    try {
      const { data } = await instance.patch(`/notification/unseen`, {
        important,
      });
      return {data, important};
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
