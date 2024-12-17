import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//assign  attendee
export const addAssign = createAsyncThunk(
  "attendee/assign",
  async ({id, payload}, { rejectWithValue, dispatch }) => {
    try {
      const response = await instance.post(`assignment/${id}`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);


export const getAssignments = createAsyncThunk(
  "assignments/fetchData",
  async ({page=1, limit=10}, { rejectWithValue }) => {
    try {
      const response = await instance.get(`assignment`,{
        params: {page, limit}
      });
      return response?.data || [];
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const addNote = createAsyncThunk(
  "note/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/notes`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getNotes = createAsyncThunk(
  "note/fetchData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/notes`, {
        params: payload
      });
      return response?.data?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);




