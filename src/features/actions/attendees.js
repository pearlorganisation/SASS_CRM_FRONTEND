import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//add Attendees
export const addAttendees = createAsyncThunk(
  "attendees/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/attendees`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get single Attendee
export const getAttendee = createAsyncThunk(
  "attendee",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/attendees/${email}`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//Update Attendee
export const updateAttendee = createAsyncThunk(
  "attendee/update",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.patch(
        `/attendees/${payload?.id}`,
        payload
      );
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get Attendees
export const getAttendees = createAsyncThunk(
  "attendees/fetchData",
  async (
    { id, isAttended, page = 1, limit = 10, filters = {} },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        `/attendees/webinar`,
        {
          filters,
          fieldName: "attendeeTableConfig",
          webinarId: id,
          isAttended,
        },
        {
          params: { page, limit },
        }
      );
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);




//get All Attendees
export const getAllAttendees = createAsyncThunk(
  "allAttendees/fetchData",
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        `/attendees/webinar`,
        {
          filters,
          fieldName: "attendeeTableConfig",
          webinarId: "",
          isAttended: false,
        },
        {
          params: { page, limit },
        }
      );
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//Update Attendee
export const updateAttendeeLeadType = createAsyncThunk(
  "attendee/lead-type/update",
  async ({ email = "", leadType = "" }, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/attendee-association`, {
        email,
        leadType,
      });
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getAttendeeLeadTypeByEmail = createAsyncThunk(
  "attendee/lead-type/fetchData",
  async (email, { rejectWithValue }) => {
    try {
      console.log( 'email ---->',email);
      const response = await instance.get(`/attendee-association/${email}`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
