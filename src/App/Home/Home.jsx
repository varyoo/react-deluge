import React from "react";
import AddTorrent from "./AddTorrent";
import { Layout } from "antd";
import RemoveTorrent from "./RemoveTorrent";
import TorrentsSider from "./TorrentsSider";
import TorrentsContent from "./TorrentsContent";
import HomeHeader from "./HomeHeader";
import TorrentDetails from "./TorrentDetails";

function Home() {
  return (
    <Layout style={{ height: "100vh" }}>
      <AddTorrent />
      <RemoveTorrent />
      <TorrentDetails />
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
