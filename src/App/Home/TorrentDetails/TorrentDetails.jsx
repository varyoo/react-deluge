import React from "react";
import { Tabs, Modal } from "antd";
import { connect } from "react-redux";
import { closeDetails } from ".";
import Files from "./Files";

function TorrentDetails({ torrent, filesData, dispatch, visible }) {
  const { name } = torrent;
  return (
    <Modal
      className="files-modal"
      title={name}
      onCancel={() => dispatch(closeDetails())}
      footer={null}
      visible={visible}
    >
      <Tabs tabPosition="top">
        <Tabs.TabPane tab="Files" key="files">
          <Files filesData={filesData} />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
}

const mapStateToProps = (state) => state.details;

export default connect(mapStateToProps)(TorrentDetails);
