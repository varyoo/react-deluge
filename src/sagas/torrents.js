import {
  call,
  put,
  select,
  take,
  delay,
  race,
  all,
  takeLatest,
} from "redux-saga/effects";
import { isRPCError } from "deluge-rpc-socket";
import { openDetails } from "../App/Home/TorrentDetails";
import { runRequest } from "./utils";
import runDetailsSagas from "./details";
import { setStats, setTableData } from "../App/Home";
import { SET_STATE, ADD_TORRENT_FILE, REMOVE_TORRENT } from "../actions";
import { readFileSync } from "fs";
import { setAddTorrentError, onTorrentAdded } from "../App/Home/AddTorrent";
import { closeRemoveTorrent } from "../App/Home/RemoveTorrent";
import { basename } from "path";
import { notifyError } from "../notify";
import { setDownloadLocation } from "../App/Home/AddTorrent";
import { getDelugeErrorMessage } from "../utils";

// user actions

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

// polling

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

function getStateFilter(state) {
  return state.home.statusFilter;
}

function* getTorrents(deluge) {
  const stateFilter = yield select(getStateFilter);
  const filterDict = {};
  if (stateFilter) {
    filterDict.state = stateFilter;
  }
  const request = deluge.core.getTorrentsStatus(filterDict, [], {});
  return yield call(runRequest, request);
}

function* getStats(deluge) {
  const request = deluge.core.getSessionStatus([
    "payload_download_rate",
    "payload_upload_rate",
  ]);
  return yield call(runRequest, request);
}

function* updateStats(deluge) {
  const stats = yield call(getStats, deluge);
  yield put(setStats(stats));
}

function* updateTorrents(deluge) {
  const torrents = yield call(getTorrents, deluge);
  const tableData = yield call(getTorrentsTableData, torrents);
  yield put(setTableData(tableData));
  yield* updateStats(deluge);
}

function* pollTorrents(deluge) {
  while (true) {
    yield call(updateTorrents, deluge);
    yield delay(1000);
  }
}

/**
 * Redux-saga's all() is actually all-or-nothing:
 * if one of the tasks throws an error,
 * all tasks that are stil running are cancelled.
 * https://redux-saga.js.org/docs/advanced/ForkModel.html
 * @param {*} deluge socket
 */
function* runTorrentsSagas(deluge) {
  while (true) {
    yield race({
      task: all([
        pollTorrents(deluge),
        watchSetTorrentState(deluge),
        watchAddTorrentFile(deluge),
        watchRemoveTorrent(deluge),
      ]),
      details: take(openDetails.type),
    });
    yield call(runDetailsSagas, deluge);
  }
}

export default runTorrentsSagas;
