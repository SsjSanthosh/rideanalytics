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

  // build data for each filter graph
  const buildGraphData = data => {
    let results = [];
    for (let d in data) {
      let obj = {};
      obj["x"] = d;
      obj["y"] = data[d];
      results.push(obj);
    }
    return results;
  };

  hours = buildGraphData(hourlyData);
  // build hourly data
  months = buildGraphData(monthlyData);
  // build monthly data

  bookings = buildGraphData(bookingData);
  // build bookingdata

  distance = buildGraphData(distanceData);
  // // build distance data

  travelType = buildGraphData(travelTypeData);
  // build travel data

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
