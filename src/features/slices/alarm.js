// ----------------------------------------------------------------------------------------------------

import { createSlice } from "@reduxjs/toolkit";
import { errorToast, successToast } from "../../utils/extra";
import { getAttendeeAlarm, setAlarm } from "../actions/alarm";

const initialState = {
  isLoading: false,
  isSuccess: false,
  isFormLoading: false,
  alarmData:[],
  attendeeAlarm: null,
  totalPages: 1,
  errorMessage: "",
};

// ---------------------------------------------------------------------------------------

export const alarmSlice = createSlice({
  name: "alarm",
  initialState,
  reducers: {
    resetAlarmSuccess: (state) => {
      state.isSuccess = false;
    },
    resetAlarmData: (state) => {
      state.alarmData = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(setAlarm.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(setAlarm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
      })
      .addCase(setAlarm.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      .addCase(getAttendeeAlarm.pending, (state, action) => {
        state.isLoading = true;
        state.isSuccess = false;
      })
      .addCase(getAttendeeAlarm.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.attendeeAlarm = action.payload
      })
      .addCase(getAttendeeAlarm.rejected, (state, action) => {
        state.isLoading = false;
        errorToast(action?.payload);
      })
      
  },
});

// -------------------------------------------------------------------------

// Action creators are generated for each case reducer function
export const { resetAlarmData, resetAlarmSuccess } = alarmSlice.actions;
export default alarmSlice.reducer;

// ================================================== THE END ============================================larm