import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//add sidebarLink
export const addSidebarLink = createAsyncThunk(
  "addSidebarLink",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`sidebar-links`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);



// get sidebarLink data
export const getAllSidebarLinks = createAsyncThunk(
  "getAllSidebarLinks",
  async (id, { rejectWithValue }) => {
    try {
      const {data} = await instance.get(`sidebar-links`);

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const deleteSidebarLink = createAsyncThunk(
  "sidebarLink/delete",
  async (id, { rejectWithValue }) => {
    try {
      const {data} = await instance.delete(`sidebar-links/${id}`);

      return data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);


