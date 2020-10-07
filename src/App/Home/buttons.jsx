import React from "react";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { openRemoveTorrent } from "./TorrentList/RemoveTorrent";
import { useDispatch } from "react-redux";
import * as actions from "../../actions";

function TorrentButton({ hash, action, children, type }) {
  const dispatch = useDispatch();
  return (
    <Button type={type} onClick={() => dispatch(action(hash))} disabled={!hash}>
      {children}
    </Button>
  );
}

export const ResumeButton = (props) => (
  <TorrentButton {...props} type="primary" action={actions.resume}>
    <PlayCircleOutlined />
    Resume
  </TorrentButton>
);

export const PauseButton = (props) => (
  <TorrentButton {...props} action={actions.pause}>
    <PauseCircleOutlined />
    Pause
  </TorrentButton>
);

export const RemoveButton = (props) => (
  <TorrentButton {...props} action={openRemoveTorrent}>
    <DeleteOutlined />
  </TorrentButton>
);
