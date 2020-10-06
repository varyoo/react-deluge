/**
 * d3.js v5 Realtime Line Chart
 * https://bost.ocks.org/mike/path/
 * https://bl.ocks.org/valex/9b27aa1644bd80e9f306633f56a8f09b
 */
import React, { createRef } from "react";
import { connect } from "react-redux";
import * as d3 from "d3";
import { COLOR_DOWNLOAD, COLOR_UPLOAD } from "../../utils";
import PropTypes from "prop-types";

const POINTS_COUNT = 40;
const STROKE_WIDTH = 3;
const MARGIN = 6;

function appendPath(clipped, color, rates, select) {
  return clipped
    .append("path")
    .datum({
      rates,
      push(stats) {
        rates.push(select(stats));
      },
    })
    .attr("class", "line")
    .attr("stroke", color)
    .attr("stroke-width", STROKE_WIDTH)
    .attr("fill", "none");
}

class TransferRateGraph extends React.Component {
  constructor() {
    super();
    this.uploadRates = new Array(POINTS_COUNT).fill(0);
    this.downloadRates = new Array(POINTS_COUNT).fill(0);
    this.svgRef = createRef();
    this.mounted = false;
  }

  componentDidMount() {
    this.mounted = true;
    const self = this;
    const svg = d3.select(this.svgRef.current);
    const width = svg.attr("width");
    const height = svg.attr("height");
    const container = svg
      .append("g")
      .attr("transform", "translate(0, " + MARGIN + ")");
    const uploadRates = this.uploadRates;
    const downloadRates = this.downloadRates;
    appendPath(
      container,
      COLOR_UPLOAD,
      uploadRates,
      ({ payloadUploadRate }) => payloadUploadRate
    );
    appendPath(
      container,
      COLOR_DOWNLOAD,
      downloadRates,
      ({ payloadDownloadRate }) => payloadDownloadRate
    );
    const scaleX = d3
      .scaleLinear()
      .domain([1, POINTS_COUNT - 2])
      .range([0, width]);
    // handle one tick (data point) on one path (either download or upload)
    function tick() {
      if (!self.mounted) {
        return;
      }
      const path = d3.select(this);
      const { rates, push } = path.datum();
      push(self.props.stats);
      const uploadMax = d3.max(uploadRates);
      const downloadMax = d3.max(downloadRates);
      const yMax = Math.max(Math.max(uploadMax, downloadMax), 1);
      let scaleY = d3
        .scaleLinear()
        .domain([0, yMax])
        .range([height - MARGIN * 2, 0]);
      let line = d3
        .line()
        .curve(d3.curveBasis)
        .x(function (d, i) {
          return scaleX(i);
        })
        .y(function (d, i) {
          return scaleY(d);
        });

      // Redraw the line.
      path
        .attr("d", function (d) {
          return line(d.rates);
        })
        .attr("transform", null);

      // Slide it to the left.
      d3.active(this)
        .attr("transform", "translate(" + scaleX(0) + ",0)")
        .transition()
        .on("start", tick);

      // Pop the old data point off the front.
      rates.shift();
    }
    // start transition on both uploadPath and downloadPath
    container
      .selectAll(".line")
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .on("start", tick);
  }

  render() {
    const { width } = this.props;
    return (
      <svg
        width={width}
        height={150}
        id="graph"
        className="graph"
        ref={this.svgRef}
      ></svg>
    );
  }
}

const mapStateToProps = (state) => {
  const { stats } = state.home;
  return {
    stats,
  };
};

TransferRateGraph.propTypes = {
  width: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(TransferRateGraph);
