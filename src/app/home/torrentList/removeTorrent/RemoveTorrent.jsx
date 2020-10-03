import React, { useCallback, useEffect } from "react";
import { Modal, Form, Button, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { closeRemoveTorrent } from ".";
import { removeTorrent } from "../../../../actions";

export default function RemoveTorrent() {
  const { visible, hashToRemove } = useSelector((state) => state.removeTorrent);
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
  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form]);
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
          label="Also delete data"
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
            Confirm removal
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}
