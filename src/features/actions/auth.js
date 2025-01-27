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
      console.log("payload", payload);
      const { data } = await instance.patch("/users", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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

export const getAllRoles = createAsyncThunk(
  "roles/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/roles`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getUserSubscription = createAsyncThunk(
  "subscription/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/subscription`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "currentUser/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`auth/current-user`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const deleteUserDocumet = createAsyncThunk(
  "userDocuments/Delete",
  async (filename, { rejectWithValue }) => {
    try {
      const { data } = await instance.delete(`/users/document/${filename}`);
      return data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getUserDocuments = createAsyncThunk(
  "userDocuments/fetchData",
  async (filename, { rejectWithValue }) => {
    try {
      const response = await instance.get(`/documents/${filename}`, {
        responseType: "blob", // Ensures the response is received as binary data
      });

      const url = window.URL.createObjectURL(response.data);

      const link = document.createElement("a");
      link.href = url;

      link.download = filename || 'downloaded_file';

      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response;
    } catch (e) {
      return rejectWithValue(e.message || "File download failed");
    }
  }
);

export const getSuperAdmin = createAsyncThunk(
  "super-admin/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await instance.get(`users/super-admin`);
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
