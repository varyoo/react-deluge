import React from "react";
import { Row, Col, Statistic } from "antd";
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

function Speed({ icon, rate, ...restProps }) {
  const { value, unit } = explodeBytes(rate, 1);
  return (
    <Statistic
      {...restProps}
      value={value}
      prefix={icon}
      suffix={unit + "/s"}
      class="lol"
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
              className="statistic-download"
            />
          </Col>
          <Col span={12} class="statistic-upload">
            <Speed
              icon={<ArrowUpOutlined height="0.5em" />}
              rate={payloadUploadRate}
              className="statistic-upload"
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
