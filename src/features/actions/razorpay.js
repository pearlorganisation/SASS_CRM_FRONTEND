import { createAsyncThunk } from "@reduxjs/toolkit";
import { instance } from "../../services/axiosInterceptor";
// import { successToast } from "../../utils/extra";

export const checkout = createAsyncThunk(
  "checkout",
  async ({ plan, durationType }, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/razorpay/checkout`, { plan, durationType });
      return response?.data;

    } catch (e) {
      return rejectWithValue(e);
    }
  }
);

export const checkoutAddon = createAsyncThunk(
  "checkout/addon",
  async ({ addon }, { rejectWithValue }) => {
    try {
      const response = await instance.post(`/razorpay/addon/checkout`, {
        addon,
      });
      return response?.data;
    } catch (e) {
      return rejectWithValue(e);
    }
  }
);
