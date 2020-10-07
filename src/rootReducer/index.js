import { combineReducers } from "@reduxjs/toolkit";
import { reducer as addTorrentReducer } from "../App/Home/TorrentList/AddTorrent";
import { reducer as removeTorrentReducer } from "../App/Home/TorrentList/RemoveTorrent";
import { reducer as userReducer } from "../user";
import { reducer as homeReducer } from "../App/Home";

export default combineReducers({
  addTorrent: addTorrentReducer,
  removeTorrent: removeTorrentReducer,
  user: userReducer,
  home: homeReducer,
});
