import React, { useCallback } from "react";
import TorrentList from "./TorrentList";
import AddTorrent, { openAddTorrent } from "./TorrentList/AddTorrent";
import { Button, Layout, PageHeader, Menu } from "antd";
import {
  CheckOutlined,
  CloudOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  FireOutlined,
  LogoutOutlined,
  PauseOutlined,
  PlusOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import RemoveTorrent from "./TorrentList/RemoveTorrent";
import { logout } from "../../user";
import SideStats from "./SideStats";
import { WIDTH_SIDER } from "../../utils";
import { filterByStatus } from "./reducer";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;

function Home() {
  const dispatch = useDispatch();
  const onAddTorrent = useCallback(() => {
    dispatch(openAddTorrent());
  }, [dispatch]);
  const onLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
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
      <Sider width={WIDTH_SIDER}>
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
