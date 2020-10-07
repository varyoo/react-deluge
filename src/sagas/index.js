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
import { notifyError, notifyWarning } from "../notify";
import { setDownloadLocation } from "../App/Home/TorrentList/AddTorrent";
import { getDelugeErrorMessage, TimeoutError } from "../utils";
import { setStats } from "../App/Home";

function getSocket(host, port) {
  return connect({
    // Deluge often runs with self-signed certificates
    rejectUnauthorized: false,
    timeout: 1000,
    host,
    port,
  });
}

function getDeluge(socket) {
  return DelugeRPC(socket, { protocolVersion: 1 });
}

export function* connectToDeluge(host, port, username, password) {
  const { socket, timeout } = yield race({
    socket: new Promise((accept) => accept(getSocket(host, port))),
    timeout: delay(1000),
  });
  if (timeout) {
    throw new TimeoutError();
  }

  const deluge = getDeluge(socket);
  // Listen for asynchronous events from daemon
  deluge.events.on("delugeEvent", console.log);
  // Non fatal decoding errors that indicate something is wrong with the protocol...
  deluge.events.on("decodingError", console.log);

  yield new Promise(function (resolve, reject) {
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

function* runRequest({ sent, result }) {
  yield sent;
  const { res, timeout } = yield race({
    res: result,
    timeout: delay(1000),
  });
  if (timeout) {
    throw new TimeoutError();
  }
  return res;
}

function* getTorrents(deluge) {
  let request = deluge.core.getTorrentsStatus([], [], {});
  return yield call(runRequest, request);
}

function* getStats(deluge) {
  const request = deluge.core.getSessionStatus([
    "payload_download_rate",
    "payload_upload_rate",
  ]);
  return yield call(runRequest, request);
}

function* pollTorrentList(deluge) {
  while (true) {
    const torrents = yield call(getTorrents, deluge);
    const tableData = yield call(getTorrentsTableData, torrents);
    yield put(setTableData(tableData));

    const stats = yield call(getStats, deluge);
    yield put(setStats(stats));

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
 * feed fake stats to Redux
 */
/*function* testStats() {
  const random = d3.randomUniform(0, 5);
  let i = 0;
  while (true) {
    yield put(
      setStats({ payloadDownloadRate: random(), payloadUploadRate: random() })
    );
    if (i % 2 == 0) {
      yield put(
        setStats({
          payloadDownloadRate: random(),
          payloadUploadRate: random(),
        })
      );
      yield put(
        setStats({
          payloadDownloadRate: random(),
          payloadUploadRate: random(),
        })
      );
      yield put(
        setStats({
          payloadDownloadRate: random(),
          payloadUploadRate: random(),
        })
      );
    }
    yield delay(500);
    i++;
  }
}*/

/**
 * Redux-saga's all() is actually all-or-nothing:
 * if one of the tasks throws an error,
 * all tasks that are stil running are cancelled.
 * https://redux-saga.js.org/docs/advanced/ForkModel.html
 * @param {*} deluge socket
 */
function* runUserSagas(deluge) {
  yield all([
    pollTorrentList(deluge),
    watchSetTorrentState(deluge),
    watchAddTorrentFile(deluge),
    watchRemoveTorrent(deluge),
    //testStats(),
  ]);
}

function* login({ payload }) {
  const { host, port, username, password } = payload;
  let deluge;
  try {
    deluge = yield call(connectToDeluge, host, port, username, password);
  } catch (err) {
    return yield put(onLoginFailed(err.message));
  }
  saveUser(host, port, username, password);
  yield put(onLoginSuccess());

  while (true) {
    try {
      yield* runUserSagas(deluge);
    } catch (err) {
      if (err instanceof TimeoutError) {
        console.error(err);
      } else {
        notifyWarning(err);
      }

      try {
        deluge = yield call(connectToDeluge, host, port, username, password);
      } catch (err) {
        return yield put(onLoginFailed(err.message));
      }
    }
  }
}

function* watchLogin() {
  yield takeLatest(LOGIN, login);
}

export default function* runAll() {
  yield all([watchLogin()]);
}
