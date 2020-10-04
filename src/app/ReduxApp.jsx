import React from "react";
import { useSelector } from "react-redux";
import { Home } from "./home";
import Login from "./login/Login";

function ReduxApp() {
  const { connected } = useSelector((state) => state.user);
  if (connected) {
    return <Home />;
  } else {
    return <Login />;
  }
}

export default ReduxApp;
