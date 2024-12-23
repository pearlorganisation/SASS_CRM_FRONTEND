import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//assign  attendee
export const addAssign = createAsyncThunk(
  "attendee/assign",
  async (
    { webinar = "", employee = "", assignments = [] },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await instance.post(`assignment`, {
        webinar,
        employee,
        assignments,
      });
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getAssignments = createAsyncThunk(
  "assignments/fetchData",
  async (
    { id = "", page = 1, limit = 10, filters = {} },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        `assignment/data/${id}`,
        {
          filters,
        },
        {
          params: { page, limit },
        }
      );
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
        params: payload,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get Attendees
export const getPullbacks = createAsyncThunk(
  "assignment/pullbacks",
  async (
    { id, page = 1, limit = 10, filters = {} },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        `/assignment/pullback`,
        { webinar: id, filters },
        {
          params: {  page, limit },
        }
      );
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
