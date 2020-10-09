import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Progress } from "antd";
import { selectHash, selectNone } from "../reducer";
import ContainerDimensions from "react-container-dimensions";

function getColumns() {
  return [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      width: "120px",
    },
    {
      title: "Progress",
      dataIndex: "progress",
      key: "progress",
      width: "180px",
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
  const { tableData, selectedHash } = useSelector((state) => state.home);
  const columns = useMemo(getColumns, []);
  const [state, setState] = useState({
    selectedRowKeys: [],
  });
  const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    type: "radio",
  };
  const dispatch = useDispatch();
  const selectRow = (record) => {
    const { key, hash } = record;
    let actionToDispatch;
    const newSelectedRowKeys = [];
    if (selectedHash === hash) {
      actionToDispatch = selectNone();
    } else {
      actionToDispatch = selectHash(hash);
      newSelectedRowKeys.push(key);
    }
    setState({ ...state, selectedRowKeys: newSelectedRowKeys });
    dispatch(actionToDispatch);
  };
  return (
    <div id="torrents-dimensions">
      <ContainerDimensions>
        {({ height }) => {
          console.log("height", height);
          return (
            <Table
              columns={columns}
              dataSource={tableData}
              rowSelection={rowSelection}
              onRow={(record) => ({
                onClick: () => selectRow(record),
                onDoubleClick: () => {},
              })}
              scroll={{ y: height - 47 }}
              pagination={false}
              size="large"
            />
          );
        }}
      </ContainerDimensions>
    </div>
  );
}
export default TorrentList;
