import { notification, message } from "antd";

export function notifyError(err, options = {}) {
  console.error(err, options);
  message.error(err.message);
}

export function notifyWarning(err, options = {}) {
  console.warn(err, options);
  notification.warning({
    message: err.message,
    placement: "bottomLeft",
  });
}
