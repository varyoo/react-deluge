import { combineReducers } from "@reduxjs/toolkit";
import { reducer as addTorrentReducer } from "../App/Home/AddTorrent";
import { reducer as removeTorrentReducer } from "../App/Home/RemoveTorrent";
import { reducer as userReducer } from "../user";
import { reducer as homeReducer } from "../App/Home";
import { reducer as detailsReducer } from "../App/Home/TorrentDetails";

export default combineReducers({
  addTorrent: addTorrentReducer,
  removeTorrent: removeTorrentReducer,
  user: userReducer,
  home: homeReducer,
  details: detailsReducer,
});
