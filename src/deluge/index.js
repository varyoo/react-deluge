import DelugeRPC from "deluge-rpc-socket";

var net = require("net");

export function getSocket() {
  var client = new net.Socket();
  client.connect(58846, "127.0.0.1", function () {
    console.log("Connected");
  });
  return client;
}

export function getRpc() {
  const socket = getSocket();
  const rpc = DelugeRPC(socket, { debug: true });
  rpc.events.on("delugeEvent", console.log);
  rpc.events.on("decodingError", console.log);
  return rpc;
}
