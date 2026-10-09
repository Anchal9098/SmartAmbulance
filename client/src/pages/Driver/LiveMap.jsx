import React, { useEffect, useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";


// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// --------------------------------------------------
// Recenter map when ambulance location changes
// --------------------------------------------------

const RecenterMap = ({ position }) => {

  const map = useMap();

  useEffect(() => {

    if (position) {

      map.setView(position, 15);

    }

  }, [position, map]);

  return null;
};


// --------------------------------------------------
// Live Map
// --------------------------------------------------

const LiveMap = () => {

  const [position, setPosition] = useState(null);

  const [gpsActive, setGpsActive] = useState(false);

  const [locationError, setLocationError] = useState("");


  // ------------------------------------------------
  // Get browser GPS
  // ------------------------------------------------

  useEffect(() => {

    if (!navigator.geolocation) {

      setLocationError(
        "GPS is not supported by this browser."
      );

      return;

    }


    const watchId =
      navigator.geolocation.watchPosition(

        (location) => {

          const latitude =
            location.coords.latitude;

          const longitude =
            location.coords.longitude;


          setPosition([
            latitude,
            longitude,
          ]);


          setGpsActive(true);

          setLocationError("");

        },


        (error) => {

          console.error(
            "GPS Error:",
            error
          );


          setGpsActive(false);


          if (error.code === 1) {

            setLocationError(
              "Location permission denied. Please allow location access."
            );

          }

          else if (error.code === 2) {

            setLocationError(
              "Unable to determine your location."
            );

          }

          else {

            setLocationError(
              "Unable to access GPS location."
            );

          }

        },


        {
          enableHighAccuracy: true,

          maximumAge: 5000,

          timeout: 10000,
        }

      );


    // Stop GPS watcher when component closes

    return () => {

      navigator.geolocation.clearWatch(
        watchId
      );

    };

  }, []);


  // ------------------------------------------------
  // Default location
  // ------------------------------------------------

  const defaultPosition = [
    21.1458,
    79.0882,
  ];


  return (

    <div className="relative w-full h-full">


      {/* -------------------------------------------
          GPS STATUS
      -------------------------------------------- */}

      <div className="absolute top-4 right-4 z-[1000]">

        <div
          className={`px-4 py-2 rounded-xl shadow-md text-sm font-semibold ${
            gpsActive
              ? "bg-green-100 text-green-700"
              : "bg-white text-slate-600"
          }`}
        >

          <span
            className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
              gpsActive
                ? "bg-green-500"
                : "bg-slate-400"
            }`}
          />

          {gpsActive
            ? "GPS Active"
            : "Waiting for GPS"}

        </div>

      </div>


      {/* -------------------------------------------
          ERROR MESSAGE
      -------------------------------------------- */}

      {locationError && (

        <div className="absolute bottom-4 left-4 right-4 z-[1000]">

          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">

            {locationError}

          </div>

        </div>

      )}


      {/* -------------------------------------------
          LEAFLET MAP
      -------------------------------------------- */}

      <MapContainer

        center={
          position ||
          defaultPosition
        }

        zoom={13}

        scrollWheelZoom={true}

        className="w-full h-full"

      >

        <TileLayer

          attribution='&copy; OpenStreetMap contributors'

          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

        />


        {/* -----------------------------------------
            AMBULANCE LOCATION
        ------------------------------------------ */}

        {position && (

          <>

            <Marker
              position={position}
            >

              <Popup>

                <div className="text-center">

                  <strong>
                    🚑 Ambulance
                  </strong>

                  <br />

                  Current GPS Location

                  <br />

                  <br />

                  Latitude:

                  <br />

                  {position[0].toFixed(6)}

                  <br />

                  <br />

                  Longitude:

                  <br />

                  {position[1].toFixed(6)}

                </div>

              </Popup>

            </Marker>


            <RecenterMap
              position={position}
            />

          </>

        )}

      </MapContainer>

    </div>

  );

};


export default LiveMap;