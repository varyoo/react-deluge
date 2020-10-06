import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    payloadUploadRate: 0,
    payloadDownloadRate: 0,
  },
};

const slice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setStats(state, { payload }) {
      state.stats = payload;
    },
  },
});

export const { setStats } = slice.actions;
export default slice.reducer;
