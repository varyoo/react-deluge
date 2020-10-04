import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import { Table, Progress } from "antd";
import { ResumeButton, PauseButton, RemoveButton } from "./buttons";

function getColumns() {
  return [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record) => {
        const hash = record.hash;
        return (
          <div>
            <ResumeButton hash={hash} />
            &nbsp;
            <PauseButton hash={hash} />
            &nbsp;
            <RemoveButton hash={hash} />
            &nbsp;
          </div>
        );
      },
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      render: (text, record) => {
        const percent = record.progress * 100;
        return <Progress percent={percent.toFixed(2)} />;
      },
    },
    {
      title: "Save path",
      dataIndex: "savePath",
      key: "savePath",
    },
  ];
}

function TorrentList() {
  const { tableData } = useSelector((state) => state.torrentList);
  const columns = useMemo(getColumns, []);
  return <Table columns={columns} dataSource={tableData} />;
}
export default TorrentList;
