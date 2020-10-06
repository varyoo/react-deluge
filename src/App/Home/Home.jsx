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
import SideStats from "./SideStats";
import { WIDTH_SIDER } from "../../utils";

const { Content, Sider } = Layout;

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
      <Sider width={WIDTH_SIDER}>
        <SideStats width={WIDTH_SIDER} />
      </Sider>
      <Layout style={{ padding: "0 50px" }}>
        <Content>
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
    </Layout>
  );
}

export default Home;
