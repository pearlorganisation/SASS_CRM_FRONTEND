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
    {
      id,
      isAttended,
      page = 1,
      limit = 10,
      filters = {},
      validCall,
      assignmentType,
    },
    { rejectWithValue }
  ) => {
    try {
      const currentTIme = new Date().getTime();
      console.log("currentTIme", currentTIme);
      const response = await instance.post(
        `/attendees/webinar`,
        {
          filters,
          fieldName: "attendeeTableConfig",
          webinarId: id,
          isAttended,
          validCall,
          assignmentType,
        },
        {
          params: { page, limit },
        }
      );
      const responseTime = new Date().getTime();
      console.log(
        "responseTime - currentTIme",
        responseTime - currentTIme,
        response
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
          isAttended: true,
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
      const response = await instance.get(`/attendee-association/${email}`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get All Attendees
export const getWebinarEnrollments = createAsyncThunk(
  "enrollments/webinar",
  async ({ id, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/enrollments/${id}`, {
        params: { page, limit },
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get All Attendees
export const getEnrollments = createAsyncThunk(
  "enrollments/attendee",
  async ({ id, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/enrollments/attendee/${id}`, {
        params: { page, limit },
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//Add Enrollment
export const addEnrollment = createAsyncThunk(
  "addEnrollment/attendee",
  async ({ attendee, product, webinar }, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/enrollments`, {
        attendee,
        product,
        webinar,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//swap Attendee Fields
export const swapAttendeeFields = createAsyncThunk(
  "attendee/swap",
  async ({ attendees = [], field1 = "", field2 = "" }, { rejectWithValue }) => {
    try {
      const { data } = await instance.put(`/attendees/swap`, {
        attendees,
        field1,
        field2,
      });
      return {
        data,field1, field2
      };
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
