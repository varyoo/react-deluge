import React, { useCallback, useEffect } from "react";
import { Modal, Form, Button, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { closeRemoveTorrent } from ".";
import { removeTorrent } from "../../../actions";
import { DeleteOutlined } from "@ant-design/icons";

export default function RemoveTorrent() {
  const { visible, hashToRemove, sessionId } = useSelector(
    (state) => state.removeTorrent
  );
  const dispatch = useDispatch();
  const onFinish = useCallback(
    ({ deleteData }) => {
      dispatch(removeTorrent(hashToRemove, deleteData));
    },
    [dispatch, hashToRemove]
  );
  const onCancel = useCallback(() => {
    dispatch(closeRemoveTorrent());
  }, [dispatch]);
  const [form] = Form.useForm();
  useEffect(() => form.resetFields(), [form, sessionId]);
  return (
    <Modal
      title="Remove Torrent"
      onCancel={onCancel}
      footer={null}
      visible={visible}
    >
      <Form
        form={form}
        initialValues={{
          deleteData: false,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Also delete data?"
          colon={false}
          name="deleteData"
          rules={[
            {
              required: true,
            },
          ]}
        >
          <Checkbox>Yes</Checkbox>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            <DeleteOutlined />
            Confirm Removal
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
