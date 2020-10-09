import {
  call,
  put,
  select,
  take,
  delay,
  all,
  race,
  putResolve,
} from "redux-saga/effects";
import { setTorrentDetails, closeDetails } from "../App/Home/TorrentDetails";
import { runRequest } from "./utils";

function* updateDetails(deluge) {
  const hash = yield select((state) => state.home.selectedHash);
  const request = deluge.core.getTorrentStatus(hash, [], {});
  const torrent = yield call(runRequest, request);
  const filesData = torrent.files.map((file, i) => {
    file.progress = torrent.fileProgress[i];
    return file;
  });
  yield put(setTorrentDetails({ torrent, filesData }));
}

function* pollDetails(deluge) {
  while (true) {
    yield call(updateDetails, deluge);
    yield delay(1000);
  }
}

function* runDetailsSagas(deluge) {
  try {
    return yield race([all([pollDetails(deluge)]), take(closeDetails.type)]);
  } finally {
    return yield putResolve(closeDetails());
  }
}

export default runDetailsSagas;
