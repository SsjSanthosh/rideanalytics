import React, { useState } from "react";
import { connect } from "react-redux";
import "./Charts.scss";
import "./../../node_modules/react-vis/dist/style.css";
import { XYPlot, XAxis, YAxis, LineSeries, VerticalBarSeries } from "react-vis";

function Charts(props) {
  const [chart, setChart] = useState("hour");
  const {
    monthlyData,
    hourlyData,
    bookingData,
    distanceData,
    travelTypeData
  } = props.mapData;
  let months = [],
    hours = [],
    bookings = [],
    distance = [],
    travelType = [],
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

  for (let d in distanceData) {
    let obj = {};
    obj["x"] = d;
    obj["y"] = distanceData[d];
    distance.push(obj);
  }

  for (let t in travelTypeData) {
    let obj = {};
    obj["x"] = t;
    obj["y"] = travelTypeData[t];

    obj["angle"] = Math.floor((travelTypeData[t] / angle) * 360);
    obj["label"] = t;
    obj["subLabel"] = Math.floor((travelTypeData[t] / angle) * 100);
    travelType.push(obj);
  }

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
        {chart === "distance" && (
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
            <VerticalBarSeries data={distance} />
          </XYPlot>
        )}
        {chart === "travelType" && (
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
            <VerticalBarSeries data={travelType} />
          </XYPlot>
        )}
      </div>
      <div className="charts-btns">
        <button onClick={() => setChart("hour")}>Pickups by the hour</button>
        <button onClick={() => setChart("booking")}>Modes of booking</button>
        <button onClick={() => setChart("month")}>
          Monthly ride frequency
        </button>
        <button onClick={() => setChart("distance")}>Rides by distance</button>
        <button onClick={() => setChart("travelType")}>Travel type </button>
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
