import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";
import { AssignmentStatus } from "../../utils/extra";

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
    {
      id = "",
      page = 1,
      limit = 10,
      filters = {},
      webinarId = "",
      validCall,
      assignmentStatus = "",
    },
    { rejectWithValue }
  ) => {
    try {
      if(!webinarId){
        console.log('empty webinarId', webinarId);
        return;
      }
      const response = await instance.post(
        `assignment/data/${id}`,
        {
          filters,
          validCall,
          assignmentStatus,
        },
        {
          params: { page, limit, webinarId },
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
  async ({ id, page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        `/assignment/pullback`,
        { webinar: id, filters },
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

export const addLeadType = createAsyncThunk(
  "lead-type/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/custom-lead-type `, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getLeadType = createAsyncThunk(
  "lead-type/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/custom-lead-type`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const updateLeadType = createAsyncThunk(
  "lead-type/update",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.patch(
        `/custom-lead-type/${payload?.id}`,
        payload
      );
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const deleteLeadType = createAsyncThunk(
  "lead-type/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/custom-lead-type/${id}`);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getDashboardNotes = createAsyncThunk(
  "dashboar-notes/fetchData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/notes/dashboard`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getAssignmentsActivity = createAsyncThunk(
  "assignments/activity/fetchData",
  async ({ empId = "" }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`assignment/activityInactivity`, {
        params: { empId },
      });
      return response?.data || [];
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const requestReAssignment = createAsyncThunk(
  "assignments/requestReAssignment",
  async ({ assignments = [], webinarId, requestReason }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`assignment/reassign`, {
        assignments,
        webinarId,
        requestReason
      });
      return {
        response: response.data,
        requestIds: assignments,
      };
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getRequestedReAssignments = createAsyncThunk(
  "ReAssignments/fetch",
  async (
    { page = 1, limit = 10, filters = {}, webinarId },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        `assignment/fetch-reassignments`,
        {
          filters,
          assignmentStatus: AssignmentStatus.REASSIGN_REQUESTED,
          webinarId,
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
