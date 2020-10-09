import { delay, race } from "redux-saga/effects";
import { TimeoutError } from "../utils";

export function* runRequest({ sent, result }) {
  yield sent;
  const { res, timeout } = yield race({
    res: result,
    timeout: delay(1000),
  });
  if (timeout) {
    throw new TimeoutError("timed out");
  }
  return res;
}
