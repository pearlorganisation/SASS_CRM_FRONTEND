import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//assign  attendee
export const createGlobalData = createAsyncThunk(
    "createGlobalData",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await instance.post(`globalData/landingpage`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return response;
      } catch (e) {
        return rejectWithValue(e);
      }
    }
  );


  export const getGlobalData = createAsyncThunk(
    "getGlobalData",
    async (_, { rejectWithValue }) => {
      try {
        const response = await instance.get(`globalData/landingpage`);
        return response.data;
      } catch (e) {
        return rejectWithValue(e);
      }
    }
  );
  
