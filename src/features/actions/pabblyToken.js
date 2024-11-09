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
  