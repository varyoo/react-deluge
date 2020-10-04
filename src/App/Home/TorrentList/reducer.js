import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  torrents: [],
};

const torrentListSlice = createSlice({
  name: "torrent_list",
  initialState,
  reducers: {
    setTableData(state, { payload }) {
      state.tableData = payload;
    },
  },
});

export const { setTableData } = torrentListSlice.actions;
export default torrentListSlice.reducer;
