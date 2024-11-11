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
  


  //assign  attendee
  export const createCustomOption = createAsyncThunk(
    "customOption/create",
    async (payload, { rejectWithValue }) => {
      try {
        const response = await instance.post(`customOptions`, payload);
        return response;
      } catch (e) {
        return rejectWithValue(e);
      }
    }
  );
    
  export const getCustomOptions = createAsyncThunk(
    "customOption/get",
    async (_, { rejectWithValue }) => {
      try {
        const response = await instance.get(`customOptions`);
        return response?.data;
      } catch (e) {
        return rejectWithValue(e);
      }
    }
  );