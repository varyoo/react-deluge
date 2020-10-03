import React, { useCallback } from "react";
import { TorrentList } from "./torrentList";
import { AddTorrent, openAddTorrent } from "./torrentList/addTorrent";
import { Button, Layout, PageHeader } from "antd";
import { CloudUploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { RemoveTorrent } from "./torrentList/removeTorrent";

const { Content } = Layout;

function Home() {
  const dispatch = useDispatch();
  const onAddTorrent = useCallback(() => {
    dispatch(openAddTorrent());
  }, [dispatch]);
  return (
    <Layout>
      <AddTorrent />
      <RemoveTorrent />
      <Content style={{ padding: "0 50px" }}>
        <PageHeader
          title="React-Deluge"
          avatar={{ icon: <CloudUploadOutlined /> }}
          extra={[
            <Button key="1" type="primary" onClick={onAddTorrent} size="large">
              Add New Torrent
            </Button>,
          ]}
        />
        <TorrentList />
      </Content>
    </Layout>
  );
}

export default Home;
