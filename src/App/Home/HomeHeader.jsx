import React from "react";
import { Layout, Avatar } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import HomeMenu from "./HomeMenu";

function HomeHeader() {
  return (
    <Layout.Header id="home-header">
      <div className="logo">
        <Avatar icon={<CloudUploadOutlined />} />
        <span className="ant-page-header-heading-title">React-Deluge</span>
      </div>
      <HomeMenu />
    </Layout.Header>
  );
}

export default HomeHeader;
