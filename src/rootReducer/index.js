import { combineReducers } from "@reduxjs/toolkit";
import { reducer as torrentListReducer } from "../App/Home/TorrentList";
import { reducer as addTorrentReducer } from "../App/Home/TorrentList/AddTorrent";
import { reducer as removeTorrentReducer } from "../App/Home/TorrentList/RemoveTorrent";
import { reducer as userReducer } from "../user";
import { reducer as homeReducer } from "../App/Home";

export default combineReducers({
  torrentList: torrentListReducer,
  addTorrent: addTorrentReducer,
  removeTorrent: removeTorrentReducer,
  user: userReducer,
  home: homeReducer,
});
