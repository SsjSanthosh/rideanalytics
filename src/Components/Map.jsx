import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import DeckGL, { ScatterplotLayer } from "deck.gl";
import {
  addMonthlyData,
  addHourlyData,
  addBookingData
} from "./../Redux/Map/MapActions";
import Immutable from "immutable";
import ScatterplotOverlay from "./ScatterplotOverlay";
import "./Map.scss";
import MapGL, { StaticMap } from "react-map-gl";

function Map(props) {
  const initialVP = {
    latitude: 12.972442,
    longitude: 77.580643,
    zoom: 11,
    center: [0, 0],
    height: "70vh",
    width: "60vw"
  };

  const initialMapState = {
    data: [],
    pickups: [],
    dropoffs: []
  };
  const [mapState, setMapState] = useState(initialMapState);
  const [monthFilter, setMonthFilter] = useState("");
  const [hourFilter, setHourFilter] = useState();
  const [viewPort, setViewPort] = useState(initialVP);
  const [pickupsOnly, setPickupsOnly] = useState(true);
  const [dropoffsOnly, setDropOffsOnly] = useState(false);
  const cleanData = (data, filter = "") => {
    const cleanData = [];
    const pickups = [];
    const dropoffs = [];
    const monthlyData = {};
    const hourlyData = {};
    const bookingData = {};
    let mobileUserCount = 0,
      onlineUserCount = 0,
      otherUserCount = 0;
    for (let d of data) {
      let booked_through;

      if (d.online_booking === "1") {
        booked_through = "online";
        onlineUserCount += 1;
      } else if (d.mobile_site_booking === "1") {
        booked_through = "mobile";
        mobileUserCount += 1;
      } else {
        booked_through = "others";
        otherUserCount += 1;
      }

      let pickedUp;
      let droppedOff;
      if (d.from_date !== "NULL") {
        pickedUp = d.from_date.split(" ")[1].split(":")[0];
        if (pickedUp.length < 2) {
          pickedUp = "0" + pickedUp;
        }
      }
      if (d.to_date !== "NULL") {
        droppedOff = d.to_date.split(" ")[1].split(":")[0];
        if (droppedOff.length < 2) {
          droppedOff = "0" + droppedOff;
        }
      }
      let pickpos, droppos;
      if (d.from_long !== "NULL") {
        pickpos = [Number(d.from_long), Number(d.from_lat)];
      }
      if (d.to_long !== "NULL") {
        droppos = [Number(d.to_long), Number(d.to_lat)];
      }
      let month;
      let months = new Array();
      months[0] = "January";
      months[1] = "February";
      months[2] = "March";
      months[3] = "April";
      months[4] = "May";
      months[5] = "June";
      months[6] = "July";
      months[7] = "August";
      months[8] = "September";
      months[9] = "October";
      months[10] = "November";
      months[11] = "December";
      if (d.from_date) {
        month = months[new Date(d.from_date.split(" ")[0]).getMonth()];
      }

      const pickup = {
        position: pickpos,
        hour: pickedUp,
        booked_through,
        pickup: true,
        month: month
      };

      monthlyData[pickup.month] = monthlyData[pickup.month]
        ? monthlyData[pickup.month] + 1
        : 1;
      hourlyData[pickup.hour] = hourlyData[pickup.hour]
        ? hourlyData[pickup.hour] + 1
        : 1;
      bookingData[pickup.booked_through] = bookingData[pickup.booked_through]
        ? bookingData[pickup.booked_through] + 1
        : 1;
      const dropped = {
        position: droppos,
        hour: droppedOff ? droppedOff : null,
        booked_through,
        pickup: false
      };
      cleanData.push(pickup);

      if (droppos && droppos[0] !== undefined) {
        dropoffs.push(droppos);
      }
      if (pickpos && pickpos[0] !== undefined) {
        pickups.push(pickpos);
      }
      cleanData.push(dropped);
    }

    props.addBookingData(bookingData);
    props.addHourlyData(hourlyData);
    props.addMonthlyData(monthlyData);
    return [cleanData, pickups, dropoffs];
  };
  const handleMonthlyFilter = () => {
    const newpickups = [];
    const newdropoffs = [];
    if (monthFilter === "") {
      return;
    }
    for (let d of mapState.data) {
      if (d.month == monthFilter) {
        if (d.pickup && d.position !== undefined) {
          newpickups.push(d.position);
        }
        if (!d.pickup && d.position !== undefined) {
          newdropoffs.push(d.position);
        }
      }
    }
    setMapState(old => {
      return {
        ...old,
        pickups: newpickups,
        dropoffs: newdropoffs
      };
    });
  };
  const handleHourFilter = () => {
    const newpickups = [];
    const newdropoffs = [];
    for (let d of mapState.data) {
      if (d.hour == hourFilter) {
        if (d.pickup && d.position !== undefined) {
          newpickups.push(d.position);
        }
        if (!d.pickup && d.position !== undefined) {
          newdropoffs.push(d.position);
        }
      }
    }
    setMapState(old => {
      return {
        ...old,
        pickups: newpickups,
        dropoffs: newdropoffs
      };
    });
  };
  const handleModeFilter = choice => {
    const newpickups = [];
    const newdropoffs = [];

    if (choice === "all") {
      for (let d of mapState.data) {
        if (d.pickup && d.position !== undefined) {
          newpickups.push(d.position);
        }
        if (!d.pickup && d.position !== undefined) {
          newdropoffs.push(d.position);
        }
      }
    } else {
      for (let d of mapState.data) {
        if (d.booked_through === choice) {
          if (d.pickup && d.position !== undefined) {
            newpickups.push(d.position);
          }
          if (!d.pickup && d.position !== undefined) {
            newdropoffs.push(d.position);
          }
        }
        continue;
      }
    }
    setMapState(old => {
      return {
        ...old,
        pickups: newpickups,
        dropoffs: newdropoffs
      };
    });
  };

  useEffect(() => {
    if (props.data.data) {
      const cleanedData = cleanData(props.data.data);

      setMapState(old => {
        return {
          data: cleanedData[0],
          pickups: cleanedData[1],
          dropoffs: cleanedData[2]
        };
      });
    }
  }, [props.data]);

  return (
    <div className="Map-Container">
      <div className="Map-Actual">
        <p>
          Upload your csv file on the left, filter the results on the right and
          check out the graphs down below!
        </p>
        <MapGL
          {...viewPort}
          onViewportChange={viewport => setViewPort(viewport)}
          mapStyle="mapbox://styles/dextrous24/ck4jfn3n011fm1cqpsvetwpmr"
          mapboxApiAccessToken="pk.eyJ1IjoiZGV4dHJvdXMyNCIsImEiOiJjazRqZXpsankxMDY2M21uenh5cXF6ZHprIn0.ky8FY-wVExN1IclibDMxGg"
          className="map-div"
        >
          {pickupsOnly && (
            <ScatterplotOverlay
              locations={Immutable.fromJS(mapState.pickups)}
              dotRadius={5}
              globalOpacity={1}
              compositeOperation="lighter"
              dotFill="lightgreen"
              renderWhileDragging={true}
            />
          )}
          {dropoffsOnly && (
            <ScatterplotOverlay
              locations={Immutable.fromJS(mapState.dropoffs)}
              dotRadius={5}
              globalOpacity={1}
              compositeOperation="source-over"
              dotFill="crimson"
              renderWhileDragging={true}
            />
          )}
        </MapGL>
        <p>
          * Dropoffs are off by default, please toggle with the filter on the
          right.
        </p>
      </div>
      <div className="Btn-Container">
        <button onClick={() => handleModeFilter("mobile")}>Only Mobile </button>
        <button onClick={() => handleModeFilter("online")}>Only Online </button>
        <button onClick={() => handleModeFilter("others")}>Only others </button>
        <button
          onClick={() => {
            handleModeFilter("all");
          }}
        >
          Show all{" "}
        </button>
        <button onClick={() => setPickupsOnly(old => !old)}>
          Toggle pickups
        </button>
        <button onClick={() => setDropOffsOnly(old => !old)}>
          Toggle dropoffs{" "}
        </button>
        <button onClick={() => handleHourFilter(12)}>Filter by time </button>
        <select
          name="monthfilter"
          onChange={e => {
            setHourFilter(e.target.value);
          }}
        >
          <option value={0}>12 :00 AM</option>
          <option value={1}>1 :00 AM</option>
          <option value={2}>2 :00 AM</option>
          <option value={3}>3 :00 AM</option>
          <option value={4}>4 :00 AM</option>
          <option value={5}>5 :00 AM</option>
          <option value={6}>6 :00 AM</option>
          <option value={7}>7 :00 AM</option>
          <option value={8}>8 :00 AM</option>
          <option value={9}>9 :00 AM</option>
          <option value={10}>10 :00 AM</option>
          <option value={11}>11 :00 AM</option>
          <option value={12}>12 :00 PM</option>
          <option value={13}>1 :00 PM</option>
          <option value={14}>2 :00 PM</option>
          <option value={15}>3 :00 PM</option>
          <option value={16}>4 :00 PM</option>
          <option value={17}>5 :00 PM</option>
          <option value={18}>6 :00 PM</option>
          <option value={19}>7 :00 PM</option>
          <option value={20}>8 :00 PM</option>
          <option value={21}>9 :00 PM</option>
          <option value={22}>10 :00 PM</option>
          <option value={23}>11 :00 PM</option>
        </select>
        <button onClick={() => handleMonthlyFilter()}>Filter by Month </button>
        <select
          name="monthfilter"
          onChange={e => {
            setMonthFilter(e.target.value);
          }}
        >
          <option value="January">January</option>
          <option value="February">February</option>
          <option value="March">March</option>
          <option value="April">April</option>
          <option value="May">May</option>
          <option value="June">June</option>
          <option value="July">July</option>
          <option value="August">August</option>
          <option value="September">September</option>
          <option value="October">October</option>
          <option value="November">November</option>
          <option value="December">December</option>
        </select>
      </div>
    </div>
  );
}

const mapStateToProps = state => {
  return {
    data: state.data,
    mapData: state.map
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addMonthlyData: data => dispatch(addMonthlyData(data)),
    addHourlyData: data => dispatch(addHourlyData(data)),
    addBookingData: data => dispatch(addBookingData(data))
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Map);
