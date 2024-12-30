import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const fetchReAssignments = createAsyncThunk(
  "assignments/fetchReAssignments",
  async (
    { page = 1, limit = 10, webinarId, status, recordType },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        `assignment/reassign/fetch`,
        {
          webinarId,
          status,
          recordType,
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

export const handleReAssigmentRequest = createAsyncThunk(
  "assignments/handleReAssigmentRequest",
  async ({ status, assignments = [] }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`assignment/reassign/approve`, {
        assignments,
        status,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const changeAssignment = createAsyncThunk(
  "assignments/reassign/change",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.patch(
        `assignment/reassign/change`,
        payload
      );
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const moveAttendeesToPullbacks = createAsyncThunk(
  "assignments/reassign/pullback",
  async ({ attendees = [], webinarId, recordType, employeeId, isTemp }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`assignment/reassign/pullback`, {
        attendees,
        webinarId,
        recordType,
        employeeId,
        isTemp,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
