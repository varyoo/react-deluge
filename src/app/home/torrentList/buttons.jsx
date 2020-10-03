import React from "react";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import { openRemoveTorrent } from "./removeTorrent";
import { useDispatch } from "react-redux";
import * as actions from "../../../actions";

export function ResumeButton({ hash }) {
  const dispatch = useDispatch();
  return (
    <Button
      type="primary"
      size="large"
      onClick={() => dispatch(actions.resume(hash))}
    >
      <PlayCircleOutlined />
      Resume
    </Button>
  );
}

export function PauseButton({ hash }) {
  const dispatch = useDispatch();
  return (
    <Button size="large" onClick={() => dispatch(actions.pause(hash))}>
      <PauseCircleOutlined />
      Pause
    </Button>
  );
}

export const RemoveButton = ({ hash }) => {
  const dispatch = useDispatch();
  return (
    <Button size="large" onClick={() => dispatch(openRemoveTorrent(hash))}>
      <DeleteOutlined />
    </Button>
  );
};
