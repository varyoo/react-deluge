import React from "react";
import { Menu } from "antd";
import { PlusOutlined, LogoutOutlined } from "@ant-design/icons";
import { openAddTorrent } from "./AddTorrent";
import { logout } from "../../user";
import { useDispatch } from "react-redux";

function MenuItem({ children, dispatch, getAction, ...itemProps }) {
  return (
    <Menu.Item {...itemProps} onClick={() => dispatch(getAction())}>
      {children}
    </Menu.Item>
  );
}

function HomeMenu() {
  const dispatch = useDispatch();
  const itemProps = {
    dispatch,
  };
  return (
    <Menu mode="horizontal" className="right" selectable={false}>
      <MenuItem {...itemProps} icon={<PlusOutlined />} getAction={openAddTorrent}>
        Add Torrent
      </MenuItem>
      <MenuItem {...itemProps} icon={<LogoutOutlined />} getAction={logout}>
        Log Out
      </MenuItem>
    </Menu>
  );
}

export default HomeMenu;
