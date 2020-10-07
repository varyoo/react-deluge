import React from "react";
import TorrentList from "./TorrentList";
import AddTorrent from "./TorrentList/AddTorrent";
import { Layout, Menu } from "antd";
import {
  CheckOutlined,
  CloudOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  FireOutlined,
  PauseOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import RemoveTorrent from "./TorrentList/RemoveTorrent";
import SideStats from "./SideStats";
import { WIDTH_SIDER } from "../../utils";
import { filterByStatus } from "./reducer";
import HomeHeaderContent from "./HomeHeaderContent";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

function Home() {
  const dispatch = useDispatch();
  const handleStatusClick = ({ key }) => {
    let filter;
    if (key !== "All") {
      filter = key;
    }
    dispatch(filterByStatus(filter));
  };
  return (
    <Layout style={{ height: "100vh" }}>
      <AddTorrent />
      <RemoveTorrent />
      <Sider width={WIDTH_SIDER} id="home-sider">
        <SideStats width={WIDTH_SIDER} />
        <Menu
          mode="inline"
          defaultSelectedKeys={["All"]}
          defaultOpenKeys={["status"]}
          style={{ borderRight: 0 }}
          theme="dark"
        >
          <SubMenu key="status" title="Filter by status" onClick={handleStatusClick}>
            <Menu.Item key="All" icon={<CloudOutlined />}>
              All
            </Menu.Item>
            <Menu.Item key="Active" icon={<FireOutlined />}>
              Active
            </Menu.Item>
            <Menu.Item key="Checking" icon={<CheckOutlined />}>
              Checking
            </Menu.Item>
            <Menu.Item key="Downloading" icon={<CloudDownloadOutlined />}>
              Downloading
            </Menu.Item>
            <Menu.Item key="Seeding" icon={<CloudUploadOutlined />}>
              Seeding
            </Menu.Item>
            <Menu.Item key="Paused" icon={<PauseOutlined />}>
              Paused
            </Menu.Item>
            <Menu.Item key="Error" icon={<WarningOutlined />}>
              Error
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
      <Layout id="home-content-layout">
        <Content>
          <Header id="home-content-header">
            <HomeHeaderContent />
          </Header>
          <div id="home-content">
            <TorrentList />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default Home;
