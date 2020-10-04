export function getDelugeErrorMessage(delugeError) {
  const { message } = delugeError;
  return message[0] + ": " + message.slice(1).join(", ");
}
