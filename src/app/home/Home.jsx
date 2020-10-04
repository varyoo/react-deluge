import React, { useCallback } from "react";
import { TorrentList } from "./torrentList";
import { AddTorrent, openAddTorrent } from "./torrentList/addTorrent";
import { Button, Layout, PageHeader } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { RemoveTorrent } from "./torrentList/removeTorrent";
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
          subTitle="Your Torrents"
          avatar={{ icon: <CloudUploadOutlined /> }}
          extra={[
            <Button key="1" type="primary" onClick={onAddTorrent}>
              Add New Torrent
            </Button>,
            <Button key="2" onClick={onLogout}>
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
