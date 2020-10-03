import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  visible: false,
};

const torrentListSlice = createSlice({
  name: "add_torrent",
  initialState,
  reducers: {
    open(state, { payload }) {
      state.visible = true;
    },
    close(state, { payload }) {
      state.visible = false;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
    onSuccess(state, { payload }) {
      state.error = undefined;
      state.visible = false;
    },
  },
});

export const { open, close, setError, onSuccess } = torrentListSlice.actions;
export default torrentListSlice.reducer;
