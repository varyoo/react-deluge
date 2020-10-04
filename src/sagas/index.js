import { call, put, takeLatest, delay, all, race } from "redux-saga/effects";
import DelugeRPC, { isRPCError } from "deluge-rpc-socket";
import { connect } from "tls";
import { setTableData } from "../App/Home/TorrentList";
import { SET_STATE, ADD_TORRENT_FILE, REMOVE_TORRENT, LOGIN } from "../actions";
import { readFileSync } from "fs";
import {
  setAddTorrentError,
  onTorrentAdded,
} from "../App/Home/TorrentList/AddTorrent";
import { closeRemoveTorrent } from "../App/Home/TorrentList/RemoveTorrent";
import { basename } from "path";
import { onLoginSuccess, onLoginFailed } from "../user/reducer.js";
import { notifyError } from "../notify";
import { setDownloadLocation } from "../App/Home/TorrentList/AddTorrent";
import { getDelugeErrorMessage } from "../utils";

function* connectToDeluge(host, port, username, password) {
  let socket, timeout;
  try {
    ({ socket, timeout } = yield race({
      socket: new Promise((accept) => {
        accept(
          connect({
            // Deluge often runs with self-signed certificates
            rejectUnauthorized: false,
            timeout: 1000,
            host,
            port,
          })
        );
      }),
      timeout: delay(1000),
    }));
    if (timeout) {
      throw new Error("timeout");
    }
  } catch (err) {
    // connect error
    yield put(onLoginFailed("Connection error : " + err.message));
    return;
  }

  let deluge;
  try {
    deluge = DelugeRPC(socket, { protocolVersion: 1 });
  } catch (err) {
    yield put(onLoginFailed(err.message));
    return;
  }
  // Listen for asynchronous events from daemon
  deluge.events.on("delugeEvent", console.log);
  // Non fatal decoding errors that indicate something is wrong with the protocol...
  deluge.events.on("decodingError", console.log);

  try {
    socket = yield new Promise(function (resolve, reject) {
      socket.on("secureConnect", resolve);
      socket.on("error", reject);
    });
  } catch (err) {
    // socket error
    yield put(onLoginFailed(err.message));
    return;
  }

  const { result, sent } = deluge.daemon.login(username, password);
  try {
    yield sent;
    const res = yield result;
    if (isRPCError(res)) {
      yield put(onLoginFailed(getDelugeErrorMessage(res)));
      return;
    }
  } catch (err) {
    yield put(onLoginFailed(err.message));
  }
  return deluge;
}

export function* getDeluge() {
  const host = localStorage.getItem("host");
  const port = localStorage.getItem("port");
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");
  return yield* connectToDeluge(host, port, username, password);
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
    if (deluge) {
      const { sent, result } = deluge.core.getTorrentsStatus([], [], {});
      yield sent;
      const torrentsStatus = yield result;
      const tableData = yield call(getTorrentsTableData, torrentsStatus);
      yield put(setTableData(tableData));
    }
    yield delay(1000);
  }
}

function* setTorrentState({ payload }) {
  const { action, hash } = payload;
  const deluge = yield call(getDeluge);
  if (!deluge) {
    return;
  }
  const { sent, result } =
    action === "pause"
      ? deluge.core.pauseTorrent([hash])
      : deluge.core.resumeTorrent([hash]);
  yield sent;
  yield result;
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
      yield put(setAddTorrentError(getDelugeErrorMessage(res)));
      return;
    }
    setDownloadLocation(downloadLocation);
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
  if (!deluge) {
    return;
  }
  const { sent, result } = deluge.core.removeTorrent(hashToRemove, deleteData);
  try {
    yield sent;
    const res = yield result;
    if (isRPCError(res)) {
      notifyError(getDelugeErrorMessage(res), { tag: "Torrent removal" });
    }
  } catch (err) {
    notifyError(err, { tag: "Torrent removal" });
  }
  yield put(closeRemoveTorrent());
}

function* watchRemoveTorrent() {
  yield takeLatest(REMOVE_TORRENT, removeTorrent);
}

function* login({ payload }) {
  const { host, port, username, password } = payload;
  const deluge = yield call(connectToDeluge, host, port, username, password);
  if (!deluge) {
    // errors are handled by connectToDeluge
    return;
  }
  localStorage.setItem("host", host);
  localStorage.setItem("port", port);
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
  yield put(onLoginSuccess());
}

function* watchLogin() {
  yield takeLatest(LOGIN, login);
}

export default function* runAll() {
  yield all([
    pollTorrentList(),
    watchSetTorrentState(),
    watchAddTorrentFile(),
    watchRemoveTorrent(),
    watchLogin(),
  ]);
}
