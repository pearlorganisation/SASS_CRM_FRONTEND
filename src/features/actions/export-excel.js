import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

export const exportClientExcel = createAsyncThunk(
  "client/exportExcel",
  async ({ limit = 100, columns = "", filters = {} }, { rejectWithValue }) => {
    try {
      const response = await instance.post(`export-excel/client`, filters, {
        params: { limit, columns },
        responseType: "blob", // Ensure you get the file as a binary Blob
      });

      // Automatically trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set file name for download
      link.setAttribute("download", "clients.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up after download

      return true; // Optional: Return a success status
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const exportWebinarAttendeesExcel = createAsyncThunk(
  "webinarAttendees/exportExcel",
  async (
    { limit = 100, columns = [], filters = {}, webinarId, isAttended = true },
    { rejectWithValue }
  ) => {
    try {
      const response = await instance.post(
        `export-excel/webinar-attendees/${webinarId}`,
        { filters, columns, fieldName: "attendeeTableConfig" },
        {
          params: { limit, isAttended },
          responseType: "blob", // Ensure you get the file as a binary Blob
        }
      );

      // Automatically trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set file name for download
      link.setAttribute("download", "clients.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up after download

      return true; // Optional: Return a success status
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
