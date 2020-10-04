import { message } from "antd";

export function notifyError(err, options = {}) {
  console.error(err, options);
  message.error(err.message);
}
