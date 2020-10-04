import React, { useCallback } from "react";
import { Button } from "antd";
import { Alert, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../actions";

// sensible defaults
const DEFAULT_HOST = "127.0.0.1";
const DEFAULT_PORT = 58846;
const DEFAULT_USERNAME = "localclient";

function LoginForm() {
  const { error } = useSelector((state) => state.user);
  const [form] = Form.useForm();
  const initialValues = {
    host: localStorage.getItem("host"),
    port: localStorage.getItem("port"),
    username: localStorage.getItem("username"),
    password: localStorage.getItem("password"),
  };
  const dispatch = useDispatch();
  const onFinish = useCallback(
    ({ host, port, username, password }) => {
      dispatch(
        login(host || DEFAULT_HOST, port || DEFAULT_PORT, username, password)
      );
    },
    [dispatch]
  );
  return (
    <Form
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
      form={form}
      name="login"
      initialValues={initialValues}
      onFinish={onFinish}
    >
      {error ? (
        <Form.Item label=" " colon={false}>
          <Alert message={error} type="error" />
        </Form.Item>
      ) : null}
      {/* Host:port */}
      <Form.Item name="host" label="Host" rules={[{ required: false }]}>
        <Input placeholder={DEFAULT_HOST} />
      </Form.Item>
      <Form.Item name="port" label="Port" rules={[{ required: false }]}>
        <Input placeholder={DEFAULT_PORT} />
      </Form.Item>
      {/* User:password */}
      <Form.Item name="username" label="Username" rules={[{ required: true }]}>
        <Input placeholder={DEFAULT_USERNAME} />
      </Form.Item>
      <Form.Item name="password" label="Password" rules={[{ required: true }]}>
        <Input.Password placeholder="Password" />
      </Form.Item>
      {/* Submit */}
      <Form.Item label=" " colon={false}>
        <Button type="primary" htmlType="submit">
          Connect
        </Button>
      </Form.Item>
    </Form>
  );
}

export default LoginForm;
