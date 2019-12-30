import React, { Component, useState } from "react";
import { connect } from "react-redux";
import "./Charts.scss";
import "./../../node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  XAxis,
  YAxis,
  RadialChart,
  LineSeries,
  Hint,
  VerticalBarSeries
} from "react-vis";

function Charts(props) {
  const [chart, setChart] = useState("hour");
  const { monthlyData, hourlyData, bookingData } = props.mapData;
  let months = [],
    hours = [],
    bookings = [],
    angle = 0;

  for (let h in hourlyData) {
    let obj = {};
    obj["x"] = h;
    obj["y"] = hourlyData[h];
    hours.push(obj);
  }
  for (let m in monthlyData) {
    let obj = {};
    obj["x"] = m;
    obj["y"] = monthlyData[m];
    months.push(obj);
  }
  for (let b in bookingData) {
    angle += bookingData[b];
  }
  for (let b in bookingData) {
    let obj = {};
    obj["x"] = b;
    obj["y"] = bookingData[b];
    obj["angle"] = Math.floor((bookingData[b] / angle) * 360);
    obj["label"] = b;
    obj["subLabel"] = Math.floor((bookingData[b] / angle) * 100);
    bookings.push(obj);
  }

  console.log(hours, months, bookings);

  return (
    <div className="charts-container">
      <div className="charts">
        {chart === "hour" && (
          <XYPlot
            height={400}
            width={900 * 0.85}
            xType="ordinal"
            color="#1adb87"
          >
            <XAxis
              title="Hour of the day"
              style={{
                text: { fill: "#fff", fontSize: 15 }
              }}
            />
            <YAxis
              style={{
                text: { fill: "#fff", fontSize: 12 }
              }}
              tickSizeOuter={0}
            />
            <VerticalBarSeries data={hours} />
          </XYPlot>
        )}
        {chart === "month" && (
          <XYPlot height={400} width={900} xType="ordinal" stroke="#1adb87">
            <XAxis
              style={{
                text: { fill: "#fff", fontSize: 13 }
              }}
            />
            <YAxis
              style={{
                text: { fill: "#fff", fontSize: 12 }
              }}
              tickSizeOuter={0}
            />
            <LineSeries data={months} />
          </XYPlot>
        )}
        {chart === "booking" && (
          <XYPlot height={400} width={700} xType="ordinal" color="#1adb87">
            <XAxis
              style={{
                text: { fill: "#fff", fontSize: 15 }
              }}
            />
            <YAxis
              style={{
                text: { fill: "#fff", fontSize: 12 }
              }}
              tickSizeOuter={0}
              tickPadding={0}
            />
            <VerticalBarSeries data={bookings} />
          </XYPlot>
        )}
      </div>
      <div className="charts-btns">
        <button onClick={() => setChart("hour")}>Pickups by the hour</button>
        <button onClick={() => setChart("booking")}>Modes of booking</button>
        <button onClick={() => setChart("month")}>
          Monthly ride frequency
        </button>
      </div>
    </div>
    /*
     */
  );
}

const mapStateToProps = state => {
  return {
    mapData: state.map
  };
};
export default connect(mapStateToProps)(Charts);
