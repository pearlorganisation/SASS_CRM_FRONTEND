import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

// Add or Update Notice Board
export const updateNoticeBoard = createAsyncThunk(
  "noticeBoard/update",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/notice-board`, payload); // This will create or update
      return response.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// Get Notice Board Data
export const getNoticeBoard = createAsyncThunk(
  "noticeBoard/get",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await instance.get(`/notice-board`);
      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
