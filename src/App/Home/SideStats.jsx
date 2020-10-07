import React from "react";
import { Row, Col, Statistic } from "antd";
import { COLOR_DOWNLOAD, COLOR_UPLOAD } from "../../utils";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import TransferRateGraph from "./TransferRateGraph";
import PropTypes from "prop-types";

/**
 * https://github.com/Flood-UI/flood/blob/master/client/src/javascript/util/size.js
 * @param {number} bytes number of bytes
 * @param {number} precision number of decimals
 */
function explodeBytes(bytes, precision = 2) {
  const kilobyte = 1024;

  const megabyte = kilobyte * 1024;

  const gigabyte = megabyte * 1024;

  const terabyte = gigabyte * 1024;
  let value = 0;

  let unit = "";

  if (bytes >= terabyte) {
    value = bytes / terabyte;
    unit = "TB";
  } else if (bytes >= gigabyte) {
    value = bytes / gigabyte;
    unit = "GB";
  } else if (bytes >= megabyte) {
    value = bytes / megabyte;
    unit = "MB";
  } else if (bytes >= kilobyte) {
    value = bytes / kilobyte;
    unit = "kB";
  } else {
    value = bytes;
    unit = "B";
  }

  value = Number(value);
  if (!!value && value >= 100) {
    value = Math.floor(value);
  } else if (!!value && value > 10) {
    value = Number(value.toFixed(precision - 1));
  } else if (value) {
    value = Number(value.toFixed(precision));
  }

  return { value, unit };
}

function Speed({ color, icon, rate }) {
  const { value, unit } = explodeBytes(rate, 1);
  return (
    <Statistic
      value={value}
      valueStyle={{ color }}
      prefix={icon}
      suffix={unit + "/s"}
    />
  );
}

export default function SideStats({ width }) {
  const { payloadDownloadRate, payloadUploadRate } = useSelector(
    (state) => state.home.stats
  );
  return (
    <div id="side-stats">
      <div id="side-rates">
        <Row gutter={0}>
          <Col span={12}>
            <Speed
              icon={<ArrowDownOutlined height="2" />}
              rate={payloadDownloadRate}
              color={COLOR_DOWNLOAD}
            />
          </Col>
          <Col span={12}>
            <Speed
              icon={<ArrowUpOutlined height="0.5em" />}
              rate={payloadUploadRate}
              color={COLOR_UPLOAD}
            />
          </Col>
        </Row>
      </div>
      <div id="side-graph">
        <TransferRateGraph width={width} />
      </div>
    </div>
  );
}

SideStats.propTypes = {
  width: PropTypes.number.isRequired,
};
