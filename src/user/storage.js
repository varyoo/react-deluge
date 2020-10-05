export function setUser(host, port, username, password) {
  localStorage.setItem("host", host);
  localStorage.setItem("port", port);
  localStorage.setItem("username", username);
  localStorage.setItem("password", password);
}

export function getUser() {
  return {
    host: localStorage.getItem("host"),
    port: localStorage.getItem("port"),
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
  };
}
