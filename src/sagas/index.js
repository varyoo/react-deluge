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
import { onLoginSuccess, onLoginFailed, setUser as saveUser } from "../user";
import { notifyError } from "../notify";
import { setDownloadLocation } from "../App/Home/TorrentList/AddTorrent";
import { getDelugeErrorMessage } from "../utils";

function* connectToDeluge(host, port, username, password) {
  let { socket, timeout } = yield race({
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
  });
  if (timeout) {
    throw new Error("timeout");
  }

  const deluge = DelugeRPC(socket, { protocolVersion: 1 });
  // Listen for asynchronous events from daemon
  deluge.events.on("delugeEvent", console.log);
  // Non fatal decoding errors that indicate something is wrong with the protocol...
  deluge.events.on("decodingError", console.log);

  socket = yield new Promise(function (resolve, reject) {
    socket.on("secureConnect", resolve);
    socket.on("error", reject);
  });

  const { result, sent } = deluge.daemon.login(username, password);
  yield sent;
  const res = yield result;
  if (isRPCError(res)) {
    throw new Error(getDelugeErrorMessage(res));
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

function* pollTorrentList(deluge) {
  while (true) {
    const { sent, result } = deluge.core.getTorrentsStatus([], [], {});
    yield sent;
    const torrentsStatus = yield result;
    const tableData = yield call(getTorrentsTableData, torrentsStatus);
    yield put(setTableData(tableData));
    yield delay(1000);
  }
}

function* setTorrentState(deluge, { payload }) {
  const { action, hash } = payload;
  const { sent, result } =
    action === "pause"
      ? deluge.core.pauseTorrent([hash])
      : deluge.core.resumeTorrent([hash]);
  yield sent;
  yield result;
}

export function* watchSetTorrentState(deluge) {
  yield takeLatest(SET_STATE, setTorrentState, deluge);
}

function* addTorrentFile(deluge, { payload }) {
  const { downloadLocation, localPath, options } = payload;
  const filename = basename(localPath);
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

function* watchAddTorrentFile(deluge) {
  yield takeLatest(ADD_TORRENT_FILE, addTorrentFile, deluge);
}

function* removeTorrent(deluge, { payload }) {
  const { hashToRemove, deleteData } = payload;
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

function* watchRemoveTorrent(deluge) {
  yield takeLatest(REMOVE_TORRENT, removeTorrent, deluge);
}

/**
 * Redux-saga's all() is actually all-or-nothing:
 * if one of the tasks throws an error,
 * all tasks that are stil running are cancelled.
 * https://redux-saga.js.org/docs/advanced/ForkModel.html
 * @param {*} deluge socket
 */
function* runUserSagas(deluge) {
  try {
    yield all([
      pollTorrentList(deluge),
      watchSetTorrentState(deluge),
      watchAddTorrentFile(deluge),
      watchRemoveTorrent(deluge),
    ]);
  } catch (err) {
    yield put(onLoginFailed(err.message));
  }
}

function* login({ payload }) {
  const { host, port, username, password } = payload;
  let deluge;
  try {
    deluge = yield call(connectToDeluge, host, port, username, password);
  } catch (err) {
    yield put(onLoginFailed(err.message));
    return;
  }
  saveUser(host, port, username, password);
  yield put(onLoginSuccess());
  yield* runUserSagas(deluge);
}

function* watchLogin() {
  yield takeLatest(LOGIN, login);
}

export default function* runAll() {
  yield all([watchLogin()]);
}
