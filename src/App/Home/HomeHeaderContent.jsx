import React from "react";
import { Avatar, Menu, Divider } from "antd";
import {
  CloudUploadOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
  PlusOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { openRemoveTorrent } from "./TorrentList/RemoveTorrent";
import * as actions from "../../actions";
import { openAddTorrent } from "./TorrentList/AddTorrent";
import { logout } from "../../user";

function MenuItem({ children, dispatch, getAction, ...itemProps }) {
  return (
    <Menu.Item {...itemProps} onClick={() => dispatch(getAction())}>
      {children}
    </Menu.Item>
  );
}

function HashMenuItem({ hash, action, children, ...itemProps }) {
  return (
    <MenuItem {...itemProps} getAction={() => action(hash)} disabled={!hash}>
      {children}
    </MenuItem>
  );
}

function HomeHeaderContent({ hash, dispatch }) {
  const itemProps = {
    hash,
    dispatch,
  };
  return (
    <>
      <div className="logo">
        <Avatar icon={<CloudUploadOutlined />} />
        <span className="ant-page-header-heading-title">React-Deluge</span>
      </div>
      <Menu mode="horizontal" className="right" selectable={false}>
        <HashMenuItem
          {...itemProps}
          icon={<PlayCircleOutlined />}
          action={actions.resume}
        >
          Resume
        </HashMenuItem>
        <HashMenuItem
          {...itemProps}
          icon={<PauseCircleOutlined />}
          action={actions.pause}
        >
          Pause
        </HashMenuItem>
        <HashMenuItem
          {...itemProps}
          icon={<DeleteOutlined />}
          action={openRemoveTorrent}
        >
          Remove
        </HashMenuItem>
        <Divider type="vertical" />
        <MenuItem {...itemProps} icon={<PlusOutlined />} getAction={openAddTorrent}>
          Add Torrent
        </MenuItem>
        <MenuItem {...itemProps} icon={<LogoutOutlined />} getAction={logout}>
          Log Out
        </MenuItem>
      </Menu>
    </>
  );
}

function mapStateToProps(state) {
  const { selectedHash: hash } = state.home;
  return { hash };
}

export default connect(mapStateToProps)(HomeHeaderContent);
