import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

//assign  attendee
export const addAssign = createAsyncThunk(
  "attendee/assign",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.patch(`attendee/assign`, payload);
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const addNote = createAsyncThunk(
  "note/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/notes`, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getNotes = createAsyncThunk(
  "note/fetchData",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/notes`, {
        params: payload
      });
      return response?.data?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);


// // get employee data
// export const getAllEmployees = createAsyncThunk(
//   "getAllEmployees",
//   async (id, { rejectWithValue }) => {
//     try {
//       const {data} = await instance.get(`/employee?adminId=${id}`);

//       return data?.data;
//     } catch (e) {
//       return rejectWithValue(e);
//     }
//   }
// );



