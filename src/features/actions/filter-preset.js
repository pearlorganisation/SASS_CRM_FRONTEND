import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//create filter preset
export const creattFilterPreset = createAsyncThunk(
  "filterPreset/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`filter-presets`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// get filter preset by table name
export const getFilterPreset = createAsyncThunk(
    "filterPreset/fetch",
    async (tableName="", { rejectWithValue }) => {
      try {
        const response = await instance.get(`filter-presets/table/${tableName}`);
        return response?.data;
      } catch (e) {
        return rejectWithValue(e);
      }
    }
  );


export const deleteFilterPreset = createAsyncThunk(
    "filterPreset/delete",
    async (id, { rejectWithValue }) => {
      try {
        const response = await instance.delete(`filter-presets/${id}`);
        return response?.data;
      } catch (e) {
        return rejectWithValue(e);
      }
    }
  );