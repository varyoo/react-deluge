import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import { connectToDeluge, __RewireAPI__ as sagasRewireAPI } from "..";

const fakeSocket = {
  on(event, callback) {},
};

sagasRewireAPI.__Rewire__("getSocket", function () {
  return fakeSocket;
});

const fakeDeluge = {
  events: {
    on: () => {},
  },
  daemon: {
    login(username, password) {
      return { result: true, sent: true };
    },
  },
};

sagasRewireAPI.__Rewire__("getDeluge", function () {
  return fakeDeluge;
});

test("connectToDeluge", () => {
  const gen = connectToDeluge();
  // start race
  gen.next();
  // create DelugeRPC from socket
  // and wait for secureConnect to happen
  gen.next({ socket: fakeSocket });
  // send login request to Deluge
  gen.next();
  // get login response
  gen.next();
  // get deluge
  let { value } = gen.next("successful login response");
  expect(value).toBe(fakeDeluge);
});
