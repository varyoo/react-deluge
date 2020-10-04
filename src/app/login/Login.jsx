import React from "react";
import { Layout, PageHeader } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import LoginForm from "./LoginForm";

const { Content } = Layout;

function Login() {
  return (
    <Layout>
      <Content style={{ padding: "0 50px" }}>
        <PageHeader
          title="React-Deluge"
          subTitle="Please login"
          avatar={{ icon: <CloudUploadOutlined /> }}
        />
        <LoginForm />
      </Content>
    </Layout>
  );
}

export default Login;
