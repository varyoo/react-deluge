import { combineReducers } from "@reduxjs/toolkit";
import { reducer as torrentListReducer } from "../app/home/torrentList";
import { reducer as addTorrentReducer } from "../app/home/torrentList/addTorrent";
import { reducer as removeTorrentReducer } from "../app/home/torrentList/removeTorrent";

export default combineReducers({
  torrentList: torrentListReducer,
  addTorrent: addTorrentReducer,
  removeTorrent: removeTorrentReducer,
});
