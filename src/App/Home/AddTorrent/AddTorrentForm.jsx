import React, { useCallback, useEffect } from "react";
import { Alert, Button, Form, Input } from "antd";
import PropTypes from "prop-types";
import { addTorrentFile } from "../../../actions";
import { useDispatch } from "react-redux";
import UploadTorrentFile from "./UploadTorrentFile";
import { getDownloadLocation } from "./storage";
import { CheckOutlined } from "@ant-design/icons";

export default function AddTorrentForm({ sessionId, error }) {
  const dispatch = useDispatch();
  const onFinish = useCallback(
    ({ downloadLocation, file }) => {
      dispatch(addTorrentFile(downloadLocation, file));
    },
    [dispatch]
  );
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, sessionId]);
  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      initialValues={{
        downloadLocation: getDownloadLocation(),
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
        <UploadTorrentFile />
      </Form.Item>
      <Form.Item label=" " colon={false}>
        <Button type="primary" htmlType="submit">
          <CheckOutlined />
          Upload
        </Button>
      </Form.Item>
    </Form>
  );
}

AddTorrentForm.propTypes = {
  sessionId: PropTypes.number,
  error: PropTypes.string,
};

AddTorrentForm.defaultProps = {
  sessionId: 1,
  error: undefined,
};
