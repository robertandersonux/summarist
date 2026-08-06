import { createSlice } from "@reduxjs/toolkit";

interface AuthModalState {
  isOpen: boolean;
  view: "login" | "register";
}

const initialState: AuthModalState = {
  isOpen: false,
  view: "login",
};

const authModalSlice = createSlice({
  name: "authModal",
  initialState,
  reducers: {
    openModal: (state, action) => {
      state.isOpen = true;
      state.view = action.payload;
    },
    closeModal: (state) => {
      state.isOpen = false;
    },
    switchView: (state, action) => {
      state.view = action.payload;
    },
  },
});

export const { openModal, closeModal, switchView } = authModalSlice.actions;
export default authModalSlice.reducer;