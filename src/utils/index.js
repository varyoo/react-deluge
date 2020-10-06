export const COLOR_DOWNLOAD = "#52c41a";
export const COLOR_UPLOAD = "#1890ff";
export const WIDTH_SIDER = 230;

export function getDelugeErrorMessage(delugeError) {
  const { message } = delugeError;
  return message[0] + ": " + message.slice(1).join(", ");
}
