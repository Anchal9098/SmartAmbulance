import React, { useState } from "react";

import {
  FaHospital,
  FaRoute,
  FaAmbulance,
  FaLocationArrow,
} from "react-icons/fa";

// ==================================================
// HOSPITAL DATA
// ==================================================

const hospitals = [
  {
    id: 1,
    name: "Government Medical College & Hospital",
    latitude: 21.1458,
    longitude: 79.0882,
  },

  {
    id: 2,
    name: "Alexis Multispeciality Hospital",
    latitude: 21.1295,
    longitude: 79.0727,
  },

  {
    id: 3,
    name: "Wockhardt Hospitals Nagpur",
    latitude: 21.1335,
    longitude: 79.0837,
  },

  {
    id: 4,
    name: "Kingsway Hospitals",
    latitude: 21.1572,
    longitude: 79.0804,
  },
];

// ==================================================
// COMPONENT
// ==================================================

const EmergencyTrip = ({ onRouteCalculated }) => {
  const [selectedHospital, setSelectedHospital] = useState("");

  const [tripStarted, setTripStarted] = useState(false);

  const [routeLoading, setRouteLoading] = useState(false);

  const [routeInfo, setRouteInfo] = useState(null);

  const [error, setError] = useState("");

  // ==================================================
  // GET CURRENT GPS LOCATION
  // ==================================================

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(
          new Error("GPS is not supported by this browser.")
        );

        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          console.log("Current GPS:", {
            latitude,
            longitude,
          });

          resolve({
            latitude,
            longitude,
          });
        },

        (gpsError) => {
          console.error("GPS Error:", gpsError);

          let message =
            "Unable to get your current location.";

          if (gpsError.code === 1) {
            message =
              "Location permission denied. Please allow GPS access.";
          }

          if (gpsError.code === 2) {
            message =
              "Current location is unavailable. Please try again.";
          }

          if (gpsError.code === 3) {
            message =
              "GPS request timed out. Please try again.";
          }

          reject(new Error(message));
        },

        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );
    });
  };

  // ==================================================
  // START EMERGENCY TRIP
  // ==================================================

  const handleStartTrip = async () => {
    setError("");
    setRouteInfo(null);

    // ----------------------------------------------
    // CHECK HOSPITAL SELECTION
    // ----------------------------------------------

    if (!selectedHospital) {
      setError("Please select a destination hospital.");
      return;
    }

    // ----------------------------------------------
    // FIND SELECTED HOSPITAL
    // ----------------------------------------------

    const hospitalId = Number(selectedHospital);

    const hospital = hospitals.find(
      (item) => item.id === hospitalId
    );

    console.log("Selected Hospital ID:", hospitalId);
    console.log("Selected Hospital:", hospital);

    if (!hospital) {
      setError("Invalid hospital selected.");
      return;
    }

    // ----------------------------------------------
    // VALIDATE HOSPITAL COORDINATES
    // ----------------------------------------------

    const endLat = Number(hospital.latitude);
    const endLng = Number(hospital.longitude);

    if (
      !Number.isFinite(endLat) ||
      !Number.isFinite(endLng)
    ) {
      setError(
        `Location coordinates are unavailable for ${hospital.name}.`
      );

      return;
    }

    console.log("Hospital Coordinates:", {
      name: hospital.name,
      latitude: endLat,
      longitude: endLng,
    });

    try {
      setRouteLoading(true);

      // ----------------------------------------------
      // GET CURRENT GPS
      // ----------------------------------------------

      const currentLocation =
        await getCurrentLocation();

      const startLat = Number(
        currentLocation.latitude
      );

      const startLng = Number(
        currentLocation.longitude
      );

      // ----------------------------------------------
      // VALIDATE CURRENT GPS
      // ----------------------------------------------

      if (
        !Number.isFinite(startLat) ||
        !Number.isFinite(startLng)
      ) {
        throw new Error(
          "Invalid ambulance GPS coordinates."
        );
      }

      console.log("Starting Coordinates:", {
        latitude: startLat,
        longitude: startLng,
      });

      // ----------------------------------------------
      // BUILD OSRM URL
      // ----------------------------------------------

      const coordinates =
        `${startLng},${startLat};${endLng},${endLat}`;

      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${coordinates}` +
        `?overview=full&geometries=geojson`;

      console.log("OSRM URL:", url);

      // ----------------------------------------------
      // CALL OSRM
      // ----------------------------------------------

      const response = await fetch(url);

      console.log(
        "OSRM Response Status:",
        response.status
      );

      if (!response.ok) {
        throw new Error(
          `Route service error (${response.status}). Please try again.`
        );
      }

      const data = await response.json();

      console.log("OSRM Data:", data);

      // ----------------------------------------------
      // CHECK OSRM RESPONSE
      // ----------------------------------------------

      if (
        data.code !== "Ok" ||
        !data.routes ||
        data.routes.length === 0
      ) {
        throw new Error(
          `No driving route found from your current location to ${hospital.name}.`
        );
      }

      // ----------------------------------------------
      // GET FIRST ROUTE
      // ----------------------------------------------

      const route = data.routes[0];

      // ----------------------------------------------
      // DISTANCE
      // ----------------------------------------------

      const distanceKm = (
        route.distance / 1000
      ).toFixed(2);

      // ----------------------------------------------
      // ESTIMATED TIME
      // ----------------------------------------------

      const durationMinutes = Math.max(
        1,
        Math.ceil(route.duration / 60)
      );

      // ----------------------------------------------
      // CREATE ROUTE DATA
      // ----------------------------------------------

      const routeData = {
        hospital: hospital,

        distanceKm: distanceKm,

        durationMinutes: durationMinutes,

        geometry: route.geometry,

        startLocation: currentLocation,

        destination: {
          latitude: endLat,
          longitude: endLng,
        },
      };

      console.log(
        "================================="
      );

      console.log(
        "ROUTE CALCULATED SUCCESSFULLY"
      );

      console.log(
        "Hospital:",
        hospital.name
      );

      console.log(
        "Distance:",
        distanceKm,
        "km"
      );

      console.log(
        "Estimated Time:",
        durationMinutes,
        "minutes"
      );

      console.log(
        "================================="
      );

      // ----------------------------------------------
      // SAVE ROUTE
      // ----------------------------------------------

      setRouteInfo(routeData);

      setTripStarted(true);

      // ----------------------------------------------
      // SEND TO DRIVER DASHBOARD
      // ----------------------------------------------

      if (onRouteCalculated) {
        onRouteCalculated(routeData);
      }
    } catch (err) {
      console.error(
        "Emergency Trip Error:",
        err
      );

      setError(
        err.message ||
          "Unable to calculate emergency route."
      );
    } finally {
      setRouteLoading(false);
    }
  };

  // ==================================================
  // CANCEL TRIP
  // ==================================================

  const handleCancelTrip = () => {
    setTripStarted(false);

    setRouteInfo(null);

    setSelectedHospital("");

    setError("");

    if (onRouteCalculated) {
      onRouteCalculated(null);
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h3 className="text-lg font-bold text-slate-800">
            Emergency Trip
          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Start an emergency route to the hospital.
          </p>
        </div>

        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
          <FaRoute className="text-blue-600 text-xl" />
        </div>

      </div>

      {/* ================================================= */}
      {/* ACTIVE TRIP */}
      {/* ================================================= */}

      {tripStarted && routeInfo ? (

        <div>

          {/* SUCCESS */}

          <div className="rounded-xl bg-green-50 border border-green-200 p-4 mb-5">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <FaAmbulance className="text-green-600" />
              </div>

              <div>

                <p className="font-semibold text-green-700">
                  Emergency Trip Active
                </p>

                <p className="text-sm text-green-600">
                  Route calculated successfully
                </p>

              </div>

            </div>

          </div>

          {/* DESTINATION */}

          <div className="mb-5">

            <p className="text-xs text-slate-500 uppercase font-semibold">
              Destination Hospital
            </p>

            <p className="font-semibold text-slate-800 mt-1">
              {routeInfo.hospital.name}
            </p>

          </div>

          {/* DISTANCE + TIME */}

          <div className="grid grid-cols-2 gap-3 mb-5">

            <div className="bg-slate-50 rounded-xl p-4">

              <p className="text-xs text-slate-500">
                Distance
              </p>

              <p className="text-xl font-bold text-slate-800">
                {routeInfo.distanceKm} km
              </p>

            </div>

            <div className="bg-slate-50 rounded-xl p-4">

              <p className="text-xs text-slate-500">
                Estimated Time
              </p>

              <p className="text-xl font-bold text-slate-800">
                {routeInfo.durationMinutes} min
              </p>

            </div>

          </div>

          {/* ROUTE READY */}

          <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">

            <FaLocationArrow className="text-blue-600" />

            <div>

              <p className="font-semibold text-blue-700">
                Route Ready
              </p>

              <p className="text-sm text-blue-600">
                Traffic signal analysis will start next.
              </p>

            </div>

          </div>

          {/* CANCEL */}

          <button
            onClick={handleCancelTrip}
            className="w-full border border-slate-300 text-slate-700 py-3 rounded-xl font-semibold hover:bg-slate-50 transition"
          >
            Cancel Emergency Trip
          </button>

        </div>

      ) : (

        <>

          {/* ================================================= */}
          {/* SELECT HOSPITAL */}
          {/* ================================================= */}

          <label className="block font-semibold text-slate-700 mb-2">
            Select Destination Hospital
          </label>

          <div className="relative mb-5">

            <FaHospital className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

            <select
              value={selectedHospital}
              onChange={(e) => {
                setSelectedHospital(e.target.value);
                setError("");
              }}
              className="w-full border border-slate-300 rounded-xl py-3 pl-11 pr-4 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >

              <option value="">
                Select hospital
              </option>

              {hospitals.map((hospital) => (
                <option
                  key={hospital.id}
                  value={hospital.id}
                >
                  {hospital.name}
                </option>
              ))}

            </select>

          </div>

          {/* SELECTED HOSPITAL COORDINATES */}

          {selectedHospital && (
            <div className="mb-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500">

              {(() => {
                const hospital = hospitals.find(
                  (item) =>
                    item.id === Number(selectedHospital)
                );

                if (!hospital) return null;

                return (
                  <>
                    <p className="font-semibold text-slate-700">
                      Selected Destination
                    </p>

                    <p className="mt-1">
                      {hospital.name}
                    </p>

                    <p className="mt-1">
                      Latitude: {hospital.latitude}
                    </p>

                    <p>
                      Longitude: {hospital.longitude}
                    </p>
                  </>
                );
              })()}

            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* START BUTTON */}

          <button
            onClick={handleStartTrip}
            disabled={routeLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
          >

            <FaRoute />

            {routeLoading
              ? "Getting GPS & Calculating Route..."
              : "Start Emergency Trip"}

          </button>

        </>

      )}

    </div>
  );
};

export default EmergencyTrip;