import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";

// ------------------------------------Async Actions----------------------------------

//Signup Api
export const signUp = createAsyncThunk(
  "user/signup",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await instance.post("auth/signup", payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//Login Api
export const logIn = createAsyncThunk(
  "user/login",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.post("auth/login", payload, {
        withCredentials: true,
      });
      console.log(data);
      return data;
    } catch (error) {
      console.log("error leleo bhia'", error);
      return rejectWithValue(error);
    }
  }
);

//Update basic Info
export const updateUser = createAsyncThunk(
  "user/Update",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.patch("/users", payload);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

//Update basic Info
export const updatePassword = createAsyncThunk(
  "userPassword/Update",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await instance.patch("/users/password", payload);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
