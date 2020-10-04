import { createAction } from "@reduxjs/toolkit";

const SET_STATE = "set_state";
const ADD_TORRENT_FILE = "add_torrent_file";
const REMOVE_TORRENT = "remove_torrent";
const LOGIN = "login";

const setStateAction = createAction(SET_STATE);
const torrentFileAction = createAction(ADD_TORRENT_FILE);

const resume = (hash) => setStateAction({ action: "resume", hash });
const pause = (hash) => setStateAction({ action: "pause", hash });

const addTorrentFile = (downloadLocation, localPath, options = {}) =>
  torrentFileAction({
    downloadLocation,
    localPath,
    ...options,
  });

const removeTorrentAction = createAction(REMOVE_TORRENT);
const removeTorrent = (hashToRemove, deleteData) =>
  removeTorrentAction({
    hashToRemove,
    deleteData,
  });

const loginAction = createAction(LOGIN);
const login = (host, port, username, password) =>
  loginAction({
    host,
    port,
    username,
    password,
  });

export {
  SET_STATE,
  ADD_TORRENT_FILE,
  REMOVE_TORRENT,
  LOGIN,
  resume,
  pause,
  addTorrentFile,
  removeTorrent,
  login,
};
