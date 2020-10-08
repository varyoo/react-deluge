import React from "react";
import AddTorrent from "./TorrentList/AddTorrent";
import { Layout } from "antd";
import RemoveTorrent from "./TorrentList/RemoveTorrent";
import TorrentsSider from "./TorrentsSider";
import TorrentsContent from "./TorrentsContent";
import HomeHeader from "./HomeHeader";

function Home() {
  return (
    <Layout style={{ height: "100vh" }}>
      <AddTorrent />
      <RemoveTorrent />
      <HomeHeader />
      <Layout id="torrents-layout">
        <TorrentsSider />
        <Layout id="torrents-main">
          <TorrentsContent />
        </Layout>
      </Layout>
    </Layout>
  );
}

export default Home;
