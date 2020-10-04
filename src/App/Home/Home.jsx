import React, { useCallback } from "react";
import TorrentList from "./TorrentList";
import AddTorrent, { openAddTorrent } from "./TorrentList/AddTorrent";
import { Button, Layout, PageHeader } from "antd";
import {
  CloudUploadOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import RemoveTorrent from "./TorrentList/RemoveTorrent";
import { logout } from "../../user";

const { Content } = Layout;

function Home() {
  const dispatch = useDispatch();
  const onAddTorrent = useCallback(() => {
    dispatch(openAddTorrent());
  }, [dispatch]);
  const onLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  return (
    <Layout style={{ height: "100vh" }}>
      <AddTorrent />
      <RemoveTorrent />
      <Content style={{ padding: "0 50px" }}>
        <PageHeader
          title="React-Deluge"
          avatar={{ icon: <CloudUploadOutlined /> }}
          extra={[
            <Button key="1" type="primary" onClick={onAddTorrent}>
              <PlusOutlined />
              Add New Torrent
            </Button>,
            <Button key="2" onClick={onLogout}>
              <LogoutOutlined />
              Log Out
            </Button>,
          ]}
        />
        <TorrentList />
      </Content>
    </Layout>
  );
}

export default Home;
