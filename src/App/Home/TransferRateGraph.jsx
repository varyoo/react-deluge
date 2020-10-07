/**
 * d3.js v5 Realtime Line Chart
 * https://bost.ocks.org/mike/path/
 * https://bl.ocks.org/valex/9b27aa1644bd80e9f306633f56a8f09b
 */
import React, { createRef } from "react";
import { connect } from "react-redux";
import * as d3 from "d3";
import PropTypes from "prop-types";

const POINTS_COUNT = 40;
const STROKE_WIDTH = 3;
const MARGIN = 6;

class TransferRateGraph extends React.Component {
  constructor() {
    super();
    this.uploadRates = new Array(POINTS_COUNT).fill(0);
    this.downloadRates = new Array(POINTS_COUNT).fill(0);
    this.svgRef = createRef();
    this.mounted = false;
  }

  appendPath(rates, pathClass) {
    return this.container
      .append("path")
      .datum(rates)
      .attr("class", "line " + pathClass)
      .attr("stroke-width", STROKE_WIDTH)
      .attr("fill", "none");
  }

  animate(rates, select, pathClass) {
    const self = this;
    const { uploadRates, downloadRates, height, scaleX } = this;
    function tick() {
      if (!self.mounted) {
        return;
      }
      const path = d3.select(this);
      const rates = path.datum();
      rates.push(select(self.props.stats));
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
      path.attr("d", line).attr("transform", null);

      // Slide it to the left.
      d3.active(this)
        .attr("transform", "translate(" + scaleX(0) + ",0)")
        .transition()
        .on("start", tick);

      // Pop the old data point off the front.
      rates.shift();
    }
    this.appendPath(rates, pathClass)
      .transition()
      .duration(1000)
      .ease(d3.easeLinear)
      .on("start", tick);
  }

  componentDidMount() {
    const svg = d3.select(this.svgRef.current);
    this.mounted = true;
    this.width = svg.attr("width");
    this.height = svg.attr("height");
    this.container = svg
      .append("g")
      .attr("transform", "translate(0, " + MARGIN + ")");
    this.scaleX = d3
      .scaleLinear()
      .domain([1, POINTS_COUNT - 2])
      .range([0, this.width]);
    this.animate(
      this.uploadRates,
      ({ payloadUploadRate }) => payloadUploadRate,
      "upload"
    );
    this.animate(
      this.downloadRates,
      ({ payloadDownloadRate }) => payloadDownloadRate,
      "download"
    );
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
