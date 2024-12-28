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