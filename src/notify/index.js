import { message } from "antd";

export function notifyError(err, options = {}) {
  console.error(err, options);
  message.error(err.message);
}

export function notifyWarning(err, options = {}) {
  console.warn(err, options);
  message.warning(err.message);
}
