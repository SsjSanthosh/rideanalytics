import React, { useState } from "react";
import { connect } from "react-redux";
import DeckGL from "@deck.gl/react";
import { LineLayer } from "@deck.gl/layers";
import uniqid from "uniqid";
import "./Map.scss";
import ReactMapGL, { StaticMap, Marker, Popup } from "react-map-gl";

const center = [0, 0];
function Map(props) {
  const [mapState, setMapState] = useState({
    latitude: 12.972442,
    longitude: 77.580643,
    zoom: 10,
    center,
    height: "50vh",
    width: "50vw"
  });

  const [showPopup, setPopup] = useState(false);
  const [curSpot, setCurSpot] = useState({});
  const { data } = props;

  const [timeData, setTimeData] = useState({});
  const times = {};
  const bookings = {};
  console.log(data.data);
  if (data.data) {
    for (let d of data.data) {
      d.from_date ? console.log(true) : console.log(false);
      // let hour = d.from_date.split(" ")[1].split(":")[0];
      // if (times[hour]) {
      //   times[hour] = times[hour] + 1;
      // } else {
      //   times[hour] = 1;
      // }
    }
  }
  if (times.length > 0) {
    setTimeData(times);
  }

  const handlePopup = async spot => {
    console.log(data);
    try {
      if (spot.to_lat !== "NULL") {
        const res = await fetch(
          `https://api.foursquare.com/v2/venues/search?ll=${spot.to_lat},${spot.to_long}&client_id=IVTEG0GDY1ACHBDWFJJRL234D03YTZKMIEYSY5HPEWOJXZIB&client_secret=FYJRTVBLN3FA4BSNUHB2XPTPWVN5FMYWHTADXJFGBCKWF0AS&v=20190924`
        );
        const data = await res.json();
        console.log(data.response.venues[0]);
        const toaddress = data.response.venues[0].name;
        spot.toAddress = toaddress;
      }
      const res = await fetch(
        `https://api.foursquare.com/v2/venues/search?ll=${spot.from_lat},${spot.from_long}&client_id=IVTEG0GDY1ACHBDWFJJRL234D03YTZKMIEYSY5HPEWOJXZIB&client_secret=FYJRTVBLN3FA4BSNUHB2XPTPWVN5FMYWHTADXJFGBCKWF0AS&v=20190924`
      );
      const data = await res.json();

      const fromaddress = data.response.venues[0].name;
      spot.fromAddress = fromaddress;

      setCurSpot(spot);
      setPopup(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ReactMapGL
      {...mapState}
      onViewportChange={viewport => setMapState(viewport)}
      mapStyle="mapbox://styles/dextrous24/ck4jfn3n011fm1cqpsvetwpmr"
      mapboxApiAccessToken="pk.eyJ1IjoiZGV4dHJvdXMyNCIsImEiOiJjazRqZXpsankxMDY2M21uenh5cXF6ZHprIn0.ky8FY-wVExN1IclibDMxGg"
    >
      {data.data
        ? data.data.map(d => {
            return (
              <Marker
                key={uniqid()}
                latitude={Number(d.from_lat)}
                longitude={Number(d.from_long)}
              >
                <i
                  class="fas fa-map-marker-alt fa-2x icon start"
                  onClick={() => handlePopup(d)}
                ></i>
              </Marker>
            );
          })
        : null}
      {showPopup ? (
        <>
          <Popup
            latitude={Number(curSpot.from_lat)}
            longitude={Number(curSpot.from_long)}
            zoom={11}
            anchor={"bottom"}
            tipSize={8}
            center={center}
            closeButton={true}
            closeOnClick={false}
            onClose={() => {
              setPopup(false);
              setCurSpot({});
            }}
            onViewportChange={viewport => {
              setMapState(viewport);
              console.log(viewport);
            }}
          >
            booked at : {curSpot.booking_created}
            <br />
            From - {curSpot.fromAddress}
            <br />
            {curSpot.toAddress
              ? `To - ${curSpot.toAddress}`
              : `Destination not specified`}
          </Popup>
        </>
      ) : null}
      {showPopup && curSpot.toAddress && (
        <>
          <Marker
            key={uniqid()}
            latitude={Number(curSpot.to_lat)}
            longitude={Number(curSpot.to_long)}
          >
            <i class="fas fa-map-marker-alt fa-2x icon end"></i>
          </Marker>
          <Popup
            latitude={Number(curSpot.to_lat)}
            longitude={Number(curSpot.to_long)}
            offsetTop={-10}
          >
            Dropped off here
          </Popup>
        </>
      )}
    </ReactMapGL>
  );
}

const mapStateToProps = state => {
  return {
    data: state.data
  };
};

export default connect(mapStateToProps)(Map);
