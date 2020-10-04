import React, { useCallback } from "react";
import { Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { closeAddTorrent } from ".";
import AddTorrentForm from "./AddTorrentForm";

export default function AddTorrent({ ...props }) {
  const { visible, sessionId, error } = useSelector((state) => state.addTorrent);
  const dispatch = useDispatch();
  const onCancel = useCallback(() => {
    dispatch(closeAddTorrent());
  }, [dispatch]);
  return (
    <Modal
      title="Add New Torrent File"
      onCancel={onCancel}
      footer={null}
      visible={visible}
    >
      <AddTorrentForm sessionId={sessionId} error={error} />
    </Modal>
  );
}
