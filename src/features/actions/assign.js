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



