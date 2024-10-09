import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//add webinar contacts
export const addWebinarContacts = createAsyncThunk(
  "addWebinarContacts",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/attendee`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get all attendees
export const getAllAttendees = createAsyncThunk(
  "getAllWebinarContacts",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/attendee/${payload.page}?${payload.filters}`);
      console.log(response)
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get webinar attendees as per csvId
// req - POST
export const getAttendees = createAsyncThunk(
  "getWebinarContacts",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/attendee/${payload.page}`, payload.data);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get webinar data
export const getAllWebinars = createAsyncThunk(
  "getAllWebinars",
  async (page, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/attendee/csvData/${page}`);

      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);




//add webinar contacts
export const deleteWebinarContacts = createAsyncThunk(
  "deleteWebinarContacts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/attendee/${id}`);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
