import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "details",
  initialState: {
    torrent: {
      name: undefined,
    },
    filesData: [],
    visible: false,
  },
  reducers: {
    openDetails(state) {
      state.visible = true;
    },
    setTorrentDetails(state, { payload }) {
      const { torrent, filesData } = payload;
      state.torrent = torrent;
      state.filesData = filesData;
    },
    closeDetails(state) {
      state.visible = false;
    },
  },
});

export const { openDetails, setTorrentDetails, closeDetails } = slice.actions;
export default slice.reducer;
