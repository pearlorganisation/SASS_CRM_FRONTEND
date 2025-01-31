import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";
import { addUserActivity } from "./userActivity";

export const exportClientExcel = createAsyncThunk(
  "client/exportExcel",
  async (
    { limit = 100, columns = "", filters = {} },
    { rejectWithValue, dispatch }
  ) => {
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

      dispatch(
        addUserActivity({
          action: "export",
          details: `User Exported the Clients, limit: ${limit}`,
        })
      );

      return true; // Optional: Return a success status
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const exportWebinarAttendeesExcel = createAsyncThunk(
  "webinarAttendees/exportExcel",
  async (payload = {}, { rejectWithValue, dispatch }) => {
    try {
      const response = await instance.post(
        `export-excel/webinar-attendees`,
        { fieldName: "attendeeTableConfig", ...payload },
        {
          responseType: "blob", // Ensure you get the file as a binary Blob
        }
      );

      // Automatically trigger download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Set file name for download
      link.setAttribute("download", "WebinarAttendees.xlsx");

      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up after download

      dispatch(
        addUserActivity({
          action: "export",
          details: `User Exported the Attendees, limit: ${
            !payload.limit ? "All" : payload.limit
          }`,
        })
      );

      return true; // Optional: Return a success status
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const exportWebinarExcel = createAsyncThunk(
  "webinar/exportExcel",
  async (
    { limit = 100, columns = [], filters = {} },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await instance.post(
        `export-excel/webinars`,
        { filters, columns },
        {
          params: { limit },
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

      dispatch(
        addUserActivity({
          action: "export",
          details: `User Exported the Webinars, limit: ${limit}`,
        })
      );

      return true; // Optional: Return a success status
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const exportEmployeesExcel = createAsyncThunk(
  "employee/exportExcel",
  async (
    { limit = 100, columns = [], filters = {} },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const response = await instance.post(
        `export-excel/employees`,
        { filters, columns },
        {
          params: { limit },
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

      dispatch(
        addUserActivity({
          action: "export",
          details: `User Exported the Employees, limit: ${limit}`,
        })
      );

      return true; // Optional: Return a success status
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
