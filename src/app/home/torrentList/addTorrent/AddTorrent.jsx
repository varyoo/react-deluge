import React, { useCallback } from "react";
import { Modal, Form, Upload, Input, Button, Alert } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { closeAddTorrent } from ".";
import { UploadOutlined } from "@ant-design/icons";
import { addTorrentFile } from "../../../../actions";

export default function AddTorrent({ ...props }) {
  const { error, visible } = useSelector((state) => state.addTorrent);
  const dispatch = useDispatch();
  const onFinish = useCallback(
    ({ downloadLocation, file }) => {
      const localPath = file.fileList[0].originFileObj.path; // FIXME
      dispatch(addTorrentFile(downloadLocation, localPath));
    },
    [dispatch]
  );
  const onCancel = useCallback(() => {
    dispatch(closeAddTorrent());
  }, [dispatch]);
  const onBeforeUpload = useCallback((file) => {
    return false;
  }, []);
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  return (
    <Modal
      title="Add New Torrent File"
      onCancel={onCancel}
      footer={null}
      visible={visible}
    >
      <Form
        {...layout}
        initialValues={{
          downloadLocation: "",
        }}
        onFinish={onFinish}
      >
        {error ? (
          <Form.Item wrapperCol={{ span: 24 }}>
            <Alert message={error} type="error" />
          </Form.Item>
        ) : null}
        <Form.Item
          label="Download location"
          name="downloadLocation"
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="file"
          label="Torrent file"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Upload beforeUpload={onBeforeUpload} multiple={false}>
            <Button icon={<UploadOutlined />}>Click to Upload (.torrent)</Button>
          </Upload>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            OK
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
