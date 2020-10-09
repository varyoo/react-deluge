import { call, put, takeLatest, delay, all, race } from "redux-saga/effects";
import DelugeRPC, { isRPCError } from "deluge-rpc-socket";
import { connect } from "tls";
import { LOGIN } from "../actions";
import { onLoginSuccess, onLoginFailed, setUser as saveUser } from "../user";
import { notifyWarning } from "../notify";
import { getDelugeErrorMessage, TimeoutError } from "../utils";
import runUserSagas from "./torrents";

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
    throw new TimeoutError("timed out");
  }

  const deluge = getDeluge(socket);
  // Listen for asynchronous events from daemon
  deluge.events.on("delugeEvent", console.warn);
  // Non fatal decoding errors that indicate something is wrong with the protocol...
  deluge.events.on("decodingError", console.error);

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
