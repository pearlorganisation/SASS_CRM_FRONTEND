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
        { filters, fieldName: "attendeeTableConfig", webinarId: id },
        {
          params: { isAttended, page, limit },
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
        { filters, fieldName: "attendeeTableConfig", webinarId: "" },
        {
          params: { isAttended: "postWebinar", page, limit },
        }
      );
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
