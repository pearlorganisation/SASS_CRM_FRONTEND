import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  modals: {},
  modalData: null,
};

const modalSlice = createSlice({
  name: "modals",
  initialState,
  reducers: {
    openModal: (state, action) => {
      if (typeof action.payload === "string") {
        state.modalData = null;
        state.modals[action.payload] = true;
      } else {
        const modalName = action.payload?.modalName;
        const data = action.payload?.data;
        if (modalName) {
          state.modals[modalName] = true;
        }
        if (data) {
          state.modalData = data;
        }
      }
    },
    closeModal: (state, action) => {
      state.modals[action.payload] = false;
    },
    resetModals: (state) => {
      state.modals = {};
    },
  },
});

export const { openModal, closeModal, resetModals } = modalSlice.actions;

export default modalSlice.reducer;
