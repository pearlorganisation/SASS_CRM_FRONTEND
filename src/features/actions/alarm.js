import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//get Attendees
export const setAlarm = createAsyncThunk(
  "alarm",
  async ({date, note}, { rejectWithValue }) => {
    try {
      const response = await instance.post(
        `/alarm`,
        {date, note}
      );
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

