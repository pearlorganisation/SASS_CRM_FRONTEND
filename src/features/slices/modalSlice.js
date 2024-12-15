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
      console.log("open modal ----> ", action.payload);
      if (typeof action.payload === "string") {
        state.modalData = null;
        state.modals[action.payload] = true;
      } else {
        const modalName = action.payload?.modalName;
        const data = action.payload?.data;
        
        if (data) {
          state.modalData = data;
        }
        if (modalName) {
          state.modals[modalName] = true;
        }
      }
    },
    closeModal: (state, action) => {
      console.log("close modal ----> ", action.payload);

      state.modals[action.payload] = false;
    },
    resetModals: (state) => {
      state.modals = {};
    },
  },
});

export const { openModal, closeModal, resetModals } = modalSlice.actions;

export default modalSlice.reducer;
