import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  stats: {
    payloadUploadRate: 0,
    payloadDownloadRate: 0,
  },
  torrents: [],
  statusFilter: undefined,
  tableData: undefined,
  selectedHash: undefined,
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
    selectHash(state, { payload }) {
      state.selectedHash = payload;
    },
    selectNone(state) {
      state.selectedHash = undefined;
    },
  },
});

export const {
  setStats,
  setTableData,
  filterByStatus,
  selectHash,
  selectNone,
} = slice.actions;
export default slice.reducer;
