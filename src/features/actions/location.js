import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//get All Locations
export const getLocations = createAsyncThunk(
  "locations",
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/location`, {
        params: { page, limit },
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//get All Location Requests
export const getLocationRequests = createAsyncThunk(
  "locations/requests",
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/location/requests`, {
        params: { page, limit },
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const approveLocation = createAsyncThunk(
  "locations/approve",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`/location/approve/${id}`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const disapproveLocation = createAsyncThunk(
  "locations/disapprove",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`/location/disapprove/${id}`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const addLocation = createAsyncThunk("locations/add", async({name, previousName}, {rejectWithValue}) => {
  try {
    const response = await instance.post('/location', {name, previousName})
    return response
  } catch (error) {
    return rejectWithValue(error)
  }
})
