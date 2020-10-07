import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    payloadUploadRate: 0,
    payloadDownloadRate: 0,
  },
  torrents: [],
  statusFilter: undefined,
  tableData: undefined,
};

const slice = createSlice({
  name: "home",
  initialState,
  reducers: {
    setStats(state, { payload }) {
      state.stats = payload;
    },
    setTableData(state, { payload }) {
      state.tableData = payload;
    },
    filterByStatus(state, { payload }) {
      state.statusFilter = payload;
    },
  },
});

export const { setStats, setTableData, filterByStatus } = slice.actions;
export default slice.reducer;
