import React from "react";
import { Table, Progress } from "antd";
import bytes from "bytes";

const columns = [
  {
    title: "Path",
    dataIndex: "path",
    key: "path",
  },
  {
    title: "Size",
    dataIndex: "size",
    key: "size",
    render: bytes,
  },
  {
    title: "Progress",
    dataIndex: "progress",
    key: "progress",
    render: (text, { progress }) => {
      const percent = progress * 100;
      return <Progress percent={percent.toFixed(2)} />;
    },
  },
];

function Files({ filesData }) {
  return (
    <Table
      columns={columns}
      dataSource={filesData}
      size="small"
      pagination={false}
    />
  );
}

export default Files;
