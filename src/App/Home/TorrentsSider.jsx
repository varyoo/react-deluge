import React from "react";
import { Layout, Menu } from "antd";
import { WIDTH_SIDER } from "../../utils";
import {
  CheckOutlined,
  CloudOutlined,
  CloudUploadOutlined,
  CloudDownloadOutlined,
  FireOutlined,
  PauseOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import SideStats from "./SideStats";
import { useDispatch } from "react-redux";
import { filterByStatus } from "./reducer";

const { Sider } = Layout;
const { SubMenu } = Menu;

function HomeSider() {
  const dispatch = useDispatch();
  const handleStatusClick = ({ key }) => {
    let filter;
    if (key !== "All") {
      filter = key;
    }
    dispatch(filterByStatus(filter));
  };
  return (
    <Sider width={WIDTH_SIDER} id="torrents-sider">
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
  );
}

export default HomeSider;
