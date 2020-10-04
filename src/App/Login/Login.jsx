import React from "react";
import { Card, Layout, PageHeader } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import LoginForm from "./LoginForm";

const { Content } = Layout;

function Login() {
  return (
    <Layout style={{ height: "100vh" }}>
      <Content style={{ padding: "0 50px" }}>
        <PageHeader
          title="React-Deluge"
          avatar={{ icon: <CloudUploadOutlined /> }}
        />
        <Card title="Please login" id="login-card">
          <LoginForm />
        </Card>
      </Content>
    </Layout>
  );
}

export default Login;
