import { call, put, takeLatest, delay, all } from "redux-saga/effects";
import DelugeRPC, { isRPCError } from "deluge-rpc-socket";
import { connect } from "tls";
import { setTableData } from "../app/home/torrentList";
import { SET_STATE, ADD_TORRENT_FILE, REMOVE_TORRENT } from "../actions";
import { readFileSync } from "fs";
import {
  setAddTorrentError,
  onTorrentAdded,
} from "../app/home/torrentList/addTorrent";
import { closeRemoveTorrent } from "../app/home/torrentList/removeTorrent";
import { basename } from "path";

export function* getDeluge() {
  let socket = connect(58846, {
    // Deluge often runs with self-signed certificates
    rejectUnauthorized: false,
  });
  const deluge = DelugeRPC(socket, { protocolVersion: 1 });
  // Listen for asynchronous events from daemon
  deluge.events.on("delugeEvent", console.log);
  // Non fatal decoding errors that indicate something is wrong with the protocol...
  deluge.events.on("decodingError", console.log);
  socket = yield new Promise(function (resolve, reject) {
    socket.on("secureConnect", resolve);
  });
  const { result, sent } = deluge.daemon.login("antoine", "antoine");
  try {
    yield sent;
    yield result;
  } catch (err) {
    console.error("login", err);
  }
  return deluge;
}

function getTorrentsTableData(torrents) {
  const data = [];
  for (const hash in torrents) {
    const torrent = torrents[hash];
    const { name, totalDone, totalSize, savePath, state } = torrent;
    const row = {
      hash,
      name,
      key: hash,
      progress: totalDone / parseFloat(totalSize),
      savePath,
      state,
    };
    data.push(row);
  }
  return data;
}

export function* pollTorrentList() {
  while (true) {
    const deluge = yield call(getDeluge);
    const { sent, result } = deluge.core.getTorrentsStatus([], [], {});
    yield sent;
    const torrentsStatus = yield result;
    const tableData = yield call(getTorrentsTableData, torrentsStatus);
    yield put(setTableData(tableData));
    yield delay(1000);
  }
}

function* setTorrentState({ payload }) {
  const { action, hash } = payload;
  const deluge = yield call(getDeluge);
  const { sent, result } =
    action === "pause"
      ? deluge.core.pauseTorrent([hash])
      : deluge.core.resumeTorrent([hash]);
  yield sent;
  return result;
}

export function* watchSetTorrentState() {
  yield takeLatest(SET_STATE, setTorrentState);
}

function* addTorrentFile({ payload }) {
  const { downloadLocation, localPath, options } = payload;
  const filename = basename(localPath);
  const deluge = yield call(getDeluge);
  const buffer = yield new Promise((resolve, reject) => {
    resolve(readFileSync(localPath));
  });
  const { sent, result } = deluge.core.addTorrentFile(filename, buffer, {
    ...options,
    download_location: downloadLocation,
  });
  try {
    yield sent;
    const res = yield result;
    if (isRPCError(res)) {
      yield put(setAddTorrentError(res.message));
      return;
    }
    yield put(onTorrentAdded());
  } catch (err) {
    yield put(setAddTorrentError(err.message));
  }
}

function* watchAddTorrentFile() {
  yield takeLatest(ADD_TORRENT_FILE, addTorrentFile);
}

function* removeTorrent({ payload }) {
  const { hashToRemove, deleteData } = payload;
  const deluge = yield call(getDeluge);
  const { sent, result } = deluge.core.removeTorrent(hashToRemove, deleteData);
  try {
    yield sent;
    const res = yield result;
    if (isRPCError(res)) {
      console.error("Torrent removal", res);
    }
  } catch (err) {
    console.error("Torrent removal", err);
  }
  yield put(closeRemoveTorrent());
}

function* watchRemoveTorrent() {
  yield takeLatest(REMOVE_TORRENT, removeTorrent);
}

export default function* runAll() {
  yield all([
    pollTorrentList(),
    watchSetTorrentState(),
    watchAddTorrentFile(),
    watchRemoveTorrent(),
  ]);
}
