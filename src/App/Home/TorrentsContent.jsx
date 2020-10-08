import React from "react";
import { PageHeader, Layout, Button } from "antd";
import TorrentList from "./TorrentList";
import { connect } from "react-redux";
import {
  PlayCircleOutlined,
  PauseCircleOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import * as actions from "../../actions";
import { openRemoveTorrent } from "./TorrentList/RemoveTorrent";

function mapStateToProps(state) {
  const { selectedHash: hash } = state.home;
  return { hash };
}

const Extra = connect(mapStateToProps)(
  ({ hash, dispatch, title, action, ...buttonProps }) => {
    return (
      <Button
        {...buttonProps}
        onClick={() => dispatch(action(hash))}
        disabled={!hash}
      >
        {title}
      </Button>
    );
  }
);

function TorrentsContent({ hash, dispatch }) {
  const extraProps = {
    dispatch,
  };
  return (
    <Layout.Content id="torrents-content">
      <PageHeader
        title="Your torrents"
        extra={[
          <Extra
            {...extraProps}
            icon={<PlayCircleOutlined />}
            title="Resume"
            action={actions.resume}
            key="resume"
          />,
          <Extra
            {...extraProps}
            icon={<PauseCircleOutlined />}
            title="Pause"
            action={actions.pause}
            key="pause"
          />,
          <Extra
            {...extraProps}
            icon={<DeleteOutlined />}
            title="Remove"
            action={openRemoveTorrent}
            key="remove"
          />,
        ]}
      />
      <TorrentList />
    </Layout.Content>
  );
}

export default TorrentsContent;
