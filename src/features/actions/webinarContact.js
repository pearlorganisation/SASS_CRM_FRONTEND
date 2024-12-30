import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";


// get webinar data
export const getAllWebinars = createAsyncThunk(
  "webinars/fetchData",
  async ({ page = 1, limit = 10, filters = {} }, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/webinar/data`,{ filters }, {
        params: { page, limit },
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);


// get webinar data
export const getAssignedEmployees = createAsyncThunk(
  "webinars/assignedEmployees",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/webinar/employee/${id}`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);




// get webinar data
export const getEmployeeWebinars = createAsyncThunk(
  "employeeWebinars/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/webinar`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// add webinar
export const createWebinar = createAsyncThunk(
  "webinars/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/webinar`, data);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

// update webinar
export const updateWebinar = createAsyncThunk(
  "webinars/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`/webinar/${id}`, data);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

//delete webinar 
export const deleteWebinar = createAsyncThunk(
  "webinar/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await instance.delete(`/webinar/${id}`);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
