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
      const response = await instance.get(
        `/attendee/${payload.page}?${payload.filters}&recordType=${payload.recordType}&limit=${payload.limit || 10}` //
      );
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
      const response = await instance.post(
        `/attendee/${payload.page}`,
        payload.data
      );
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

// get all assignments
export const getAllAssignments = createAsyncThunk(
  "getAllAssignments",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/attendee/employee/assignments`, {
        params: payload,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getAttendeeContactDetails = createAsyncThunk(
  "attendeeContact/fetchData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/attendee`, {
        params: payload,
      });
      if (
        response &&
        response?.data &&
        Array.isArray(response.data?.data) &&
        response.data.data.length > 0
      ) {
        return response.data.data[0];
      }
      return null;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const updateAttendeeDetails = createAsyncThunk(
  "attendeeDetails/updateData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`/attendee`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const updateAttendeeLeadType = createAsyncThunk(
  "attendeeLeadType/updateData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`/attendee/leadType`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);