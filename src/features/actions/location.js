import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//get All Locations
export const getLocations = createAsyncThunk(
    "locations",
    async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
      try {
        const response = await instance.get(
          `/location`,
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


  //get All Location Requests
export const getLocationRequests = createAsyncThunk(
  "locations/requests",
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await instance.get(
        `/location/requests`,
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
  





