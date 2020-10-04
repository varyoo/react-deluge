import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  connected: false,
  error: undefined,
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onLoginSuccess(state) {
      state.connected = true;
      state.error = undefined;
    },
    onLoginFailed(state, { payload }) {
      state.connected = false;
      state.error = payload;
    },
    logout(state) {
      state.connected = false;
    },
  },
});

export const { onLoginSuccess, onLoginFailed, logout } = slice.actions;
export default slice.reducer;
