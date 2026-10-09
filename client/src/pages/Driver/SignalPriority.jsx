import React, { useEffect, useState } from "react";

import { supabase } from "../../lib/supabaseClient";

import {
  FaTrafficLight,
  FaCheckCircle,
  FaExclamationTriangle,
  FaRoute,
  FaBolt,
} from "react-icons/fa";

const SignalPriority = ({
  routeActive = false,
  routeAvailable = false,
  route = null,
  ambulanceId = null,
  tripId = null,
  signals = [],
}) => {

  // =========================================================
  // STATE
  // =========================================================

  const [priorityActive, setPriorityActive] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // =========================================================
  // SIGNAL DATA
  // =========================================================

  const trafficSignals = Array.isArray(signals)
    ? signals
    : [];

  // =========================================================
  // ACTUAL ROUTE CHECK
  // =========================================================

  const hasRoute =
    routeAvailable &&
    route &&
    route.geometry &&
    Array.isArray(route.geometry.coordinates) &&
    route.geometry.coordinates.length > 0;

  // =========================================================
  // DEBUG
  // =========================================================

  useEffect(() => {

    console.log(
      "================================="
    );

    console.log(
      "SIGNAL PRIORITY DATA"
    );

    console.log(
      "routeActive:",
      routeActive
    );

    console.log(
      "routeAvailable:",
      routeAvailable
    );

    console.log(
      "route:",
      route
    );

    console.log(
      "hasRoute:",
      hasRoute
    );

    console.log(
      "ambulanceId:",
      ambulanceId
    );

    console.log(
      "tripId:",
      tripId
    );

    console.log(
      "trafficSignals:",
      trafficSignals
    );

    console.log(
      "================================="
    );

  }, [
    routeActive,
    routeAvailable,
    route,
    ambulanceId,
    tripId,
    trafficSignals.length,
  ]);

  // =========================================================
  // RESET PRIORITY WHEN ROUTE CHANGES
  // =========================================================

  useEffect(() => {

    setPriorityActive(false);

    setMessage("");

  }, [route]);

  // =========================================================
  // REQUEST SIGNAL PRIORITY
  // =========================================================

  const handlePriorityRequest = async () => {

    // -------------------------------------------------------
    // CHECK ACTUAL ROUTE
    // -------------------------------------------------------

    if (!hasRoute) {

      setMessage(
        "Emergency route information is not available. Please calculate the route first."
      );

      return;
    }

    // -------------------------------------------------------
    // CHECK AMBULANCE
    // -------------------------------------------------------

    if (!ambulanceId) {

      setMessage(
        "Ambulance information is not available."
      );

      return;
    }

    // -------------------------------------------------------
    // CHECK SIGNALS
    // -------------------------------------------------------

    if (trafficSignals.length === 0) {

      setMessage(
        "No traffic signals are available."
      );

      return;
    }

    // -------------------------------------------------------
    // START LOADING
    // -------------------------------------------------------

    setLoading(true);

    setMessage("");

    try {

      // =====================================================
      // CREATE REQUESTS
      // =====================================================

      /*
       * trip_id is allowed to be NULL.
       *
       * This is important because EmergencyTrip calculates
       * the route locally, while the database trip row may
       * not exist yet.
       */

      const requests =
        trafficSignals.map((signal) => ({

          ambulance_id:
            ambulanceId,

          signal_id:
            signal.id,

          trip_id:
            tripId || null,

          requested_at:
            new Date().toISOString(),

        }));

      console.log(
        "================================="
      );

      console.log(
        "SIGNAL PRIORITY REQUEST"
      );

      console.log(
        "Route:",
        route
      );

      console.log(
        "Requests:",
        requests
      );

      console.log(
        "================================="
      );

      // =====================================================
      // INSERT INTO SUPABASE
      // =====================================================

      const { error } =
        await supabase
          .from(
            "signal_priority_requests"
          )
          .insert(requests);

      // =====================================================
      // HANDLE ERROR
      // =====================================================

      if (error) {

        console.error(
          "Signal priority database error:",
          error
        );

        setMessage(
          `Failed to request signal priority: ${error.message}`
        );

        setLoading(false);

        return;
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      console.log(
        "Signal priority requests created successfully."
      );

      setPriorityActive(true);

      setMessage(
        "Signal priority has been activated for the emergency route."
      );

    } catch (error) {

      console.error(
        "Signal priority exception:",
        error
      );

      setMessage(
        error.message ||
        "Something went wrong while requesting signal priority."
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================================================
  // CANCEL SIGNAL PRIORITY
  // =========================================================

  const handleCancelPriority = () => {

    setPriorityActive(false);

    setMessage(
      "Signal priority has been cancelled."
    );
  };

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="p-5 border-b border-slate-200 flex items-center justify-between">

        <div>

          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">

            <FaTrafficLight className="text-yellow-500" />

            Signal Priority

          </h3>

          <p className="text-sm text-slate-500 mt-1">
            Manage traffic signal priority for the emergency route.
          </p>

        </div>

        {/* PRIORITY STATUS */}

        {priorityActive ? (

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm">

            <FaCheckCircle />

            Signal Priority ACTIVE

          </div>

        ) : (

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-semibold text-sm">

            <FaTrafficLight />

            Priority Inactive

          </div>

        )}

      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className="p-5">

        {/* ===================================================
            ROUTE INFORMATION
        =================================================== */}

        <div
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            hasRoute
              ? "bg-green-50 border-green-200"
              : "bg-blue-50 border-blue-100"
          }`}
        >

          <div
            className={`w-11 h-11 rounded-lg flex items-center justify-center ${
              hasRoute
                ? "bg-green-100"
                : "bg-blue-100"
            }`}
          >

            <FaRoute
              className={
                hasRoute
                  ? "text-green-600 text-lg"
                  : "text-blue-600 text-lg"
              }
            />

          </div>

          <div>

            <p className="font-semibold text-slate-800">
              Emergency Route
            </p>

            <p className="text-sm text-slate-500">

              {hasRoute
                ? `Route loaded successfully${
                    route.distanceKm
                      ? ` • ${route.distanceKm} km`
                      : ""
                  }${
                    route.durationMinutes
                      ? ` • ${route.durationMinutes} min`
                      : ""
                  }`
                : routeActive
                ? "Emergency trip is active, but route data is not loaded."
                : "No emergency route available."}

            </p>

          </div>

        </div>

        {/* ===================================================
            TRAFFIC SIGNALS
        =================================================== */}

        <div className="mt-5">

          <div className="flex items-center justify-between mb-3">

            <h4 className="font-semibold text-slate-800">
              Traffic Signals on Route
            </h4>

            <span className="text-sm text-slate-500">
              {trafficSignals.length} signals
            </span>

          </div>

          {trafficSignals.length === 0 ? (

            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">

              No traffic signals found.

            </div>

          ) : (

            <div className="space-y-3">

              {trafficSignals.map(
                (signal, index) => (

                  <div
                    key={
                      signal.id ||
                      `signal-${index}`
                    }
                    className={`flex items-center justify-between p-4 rounded-xl border ${
                      priorityActive
                        ? "border-green-200 bg-green-50"
                        : "border-slate-200 bg-slate-50"
                    }`}
                  >

                    {/* SIGNAL INFORMATION */}

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          priorityActive
                            ? "bg-green-100"
                            : "bg-yellow-100"
                        }`}
                      >

                        <FaTrafficLight
                          className={
                            priorityActive
                              ? "text-green-600"
                              : "text-yellow-600"
                          }
                        />

                      </div>

                      <div>

                        <p className="font-semibold text-slate-800">

                          {signal.name ||
                            signal.signal_name ||
                            `Signal ${index + 1}`}

                        </p>

                        <p className="text-sm text-slate-500">

                          {signal.signal_code ||
                            "Traffic signal"}

                        </p>

                      </div>

                    </div>

                    {/* SIGNAL STATUS */}

                    {priorityActive ? (

                      <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">

                        Priority Requested

                      </span>

                    ) : (

                      <span className="px-3 py-1 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold">

                        Normal

                      </span>

                    )}

                  </div>

                )
              )}

            </div>

          )}

        </div>

        {/* ===================================================
            ROUTE WARNING
        =================================================== */}

        {!hasRoute && (

          <div className="mt-5 flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">

            <FaExclamationTriangle className="text-red-500 mt-1" />

            <p className="text-sm text-red-600">

              {routeActive
                ? "Emergency trip is active, but route information is not available."
                : "Start an emergency trip and calculate the route before requesting signal priority."}

            </p>

          </div>

        )}

        {/* ===================================================
            AMBULANCE WARNING
        =================================================== */}

        {!ambulanceId && (

          <div className="mt-5 flex gap-3 p-4 rounded-xl bg-red-50 border border-red-200">

            <FaExclamationTriangle className="text-red-500 mt-1" />

            <p className="text-sm text-red-600">
              Ambulance information is not available.
            </p>

          </div>

        )}

        {/* ===================================================
            MESSAGE
        =================================================== */}

        {message && (

          <div
            className={`mt-5 p-4 rounded-xl text-sm ${
              priorityActive
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >

            {message}

          </div>

        )}

        {/* ===================================================
            BUTTON
        =================================================== */}

        <div className="mt-5">

          {!priorityActive ? (

            <button
              type="button"
              onClick={
                handlePriorityRequest
              }
              disabled={
                !hasRoute ||
                !ambulanceId ||
                trafficSignals.length === 0 ||
                loading
              }
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
            >

              <FaBolt />

              {loading
                ? "Activating Signal Priority..."
                : "Request Signal Priority"}

            </button>

          ) : (

            <button
              type="button"
              onClick={
                handleCancelPriority
              }
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
            >

              Cancel Signal Priority

            </button>

          )}

        </div>

        {/* ===================================================
            DEBUG INFORMATION
        =================================================== */}

        <div className="mt-4 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm">

          <p className="text-slate-500">
            Route:
            <span className="font-semibold text-slate-700 ml-1">
              {hasRoute
                ? "Loaded"
                : "Not loaded"}
            </span>
          </p>

          <p className="text-slate-500 mt-1">
            Trip ID:
            <span className="font-semibold text-slate-700 ml-1">
              {tripId || "Not available"}
            </span>
          </p>

          <p className="text-slate-500 mt-1">
            Ambulance ID:
            <span className="font-semibold text-slate-700 ml-1">
              {ambulanceId || "Not available"}
            </span>
          </p>

          <p className="text-slate-500 mt-1">
            Traffic Signals:
            <span className="font-semibold text-slate-700 ml-1">
              {trafficSignals.length}
            </span>
          </p>

        </div>

      </div>

    </div>
  );
};

export default SignalPriority;