import React, { useEffect, useState } from "react";

import { supabase } from "../../lib/supabaseClient";

import DriverHeader from "./DriverHeader";
import DriverSidebar from "./DriverSidebar";
import StatusCards from "./StatusCards";
import EmergencyTrip from "./EmergencyTrip";
import LiveMap from "./LiveMap";
import SignalPriority from "./SignalPriority";

const DriverDashboard = () => {
  // =========================================================
  // STATE
  // =========================================================

  const [ambulanceId, setAmbulanceId] = useState(null);

  const [tripId, setTripId] = useState(null);

  const [tripActive, setTripActive] = useState(false);

  const [trafficSignals, setTrafficSignals] = useState([]);

  const [route, setRoute] = useState(null);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // ROUTE CALLBACK
  // EmergencyTrip sends the calculated route here
  // =========================================================

  const handleRouteCalculated = (routeData) => {
    console.log("=================================");
    console.log("ROUTE RECEIVED BY DRIVER DASHBOARD");
    console.log("Route:", routeData);
    console.log("=================================");

    if (routeData) {
      setRoute(routeData);
      setTripActive(true);

      console.log("Route successfully stored in Dashboard.");
    } else {
      // Emergency trip was cancelled
      setRoute(null);
      setTripActive(false);

      console.log("Emergency route cleared.");
    }
  };

  // =========================================================
  // LOAD DRIVER DATA
  // =========================================================

  const loadDriverData = async () => {
    try {
      setErrorMessage("");

      // =====================================================
      // GET LOGGED-IN USER
      // =====================================================

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("User error:", userError);

        setErrorMessage(userError.message);

        return;
      }

      if (!user) {
        console.error("No logged-in user.");

        setErrorMessage("No logged-in user found.");

        return;
      }

      console.log("Logged-in user:", user.id);

      // =====================================================
      // GET AMBULANCE
      // =====================================================

      const {
        data: ambulance,
        error: ambulanceError,
      } = await supabase
        .from("ambulances")
        .select("id, vehicle_number, driver_id, status")
        .eq("driver_id", user.id)
        .maybeSingle();

      if (ambulanceError) {
        console.error("Ambulance error:", ambulanceError);

        /*
         * Do not destroy the locally calculated route here.
         * The route comes from EmergencyTrip and is independent
         * of this refresh request.
         */

        setAmbulanceId(null);

        setErrorMessage(
          `Failed to load ambulance: ${ambulanceError.message}`
        );
      } else if (ambulance) {
        console.log("Ambulance:", ambulance);

        setAmbulanceId(ambulance.id);
      } else {
        console.log("No ambulance assigned to this driver.");

        setAmbulanceId(null);
      }

      // =====================================================
      // GET LATEST DATABASE TRIP
      // =====================================================

      if (ambulance) {
        const {
          data: trip,
          error: tripError,
        } = await supabase
          .from("ambulance_trips")
          .select("*")
          .eq("ambulance_id", ambulance.id)
          .order("started_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

        if (tripError) {
          console.error("Trip error:", tripError);

          /*
           * IMPORTANT:
           * Do not clear the locally calculated route.
           *
           * EmergencyTrip may have calculated a route even
           * when there is no database trip row.
           */

          setTripId(null);

          // Only keep locally active route if one exists
          if (!route) {
            setTripActive(false);
          }
        } else if (trip) {
          console.log("Latest database trip:", trip);

          setTripId(trip.id);

          const status = String(
            trip.status || ""
          ).toLowerCase();

          const activeStatuses = [
            "active",
            "emergency",
            "in_progress",
            "in-progress",
            "started",
            "ongoing",
            "en_route",
            "en-route",
            "dispatched",
          ];

          const inactiveStatuses = [
            "completed",
            "cancelled",
            "canceled",
            "ended",
            "finished",
          ];

          if (activeStatuses.includes(status)) {
            setTripActive(true);
          } else if (inactiveStatuses.includes(status)) {
            /*
             * Do not remove a route that was just calculated
             * locally by EmergencyTrip.
             */
            if (!route) {
              setTripActive(false);
            }
          } else {
            /*
             * If a database trip exists but status is unknown,
             * keep the trip active.
             */
            setTripActive(true);
          }
        } else {
          console.log("No database trip found.");

          setTripId(null);

          /*
           * A locally calculated route is still valid.
           */
          if (!route) {
            setTripActive(false);
          }
        }
      } else {
        setTripId(null);

        /*
         * Do not destroy locally calculated route.
         */
        if (!route) {
          setTripActive(false);
        }
      }

      // =====================================================
      // GET TRAFFIC SIGNALS
      // =====================================================

      const {
        data: signals,
        error: signalsError,
      } = await supabase
        .from("traffic_signals")
        .select(
          "id, signal_code, signal_name, latitude, longitude, status"
        );

      if (signalsError) {
        console.error(
          "Traffic signals error:",
          signalsError
        );

        setTrafficSignals([]);

        /*
         * Only show this error if the signal table itself
         * failed.
         */
        setErrorMessage(
          `Failed to load traffic signals: ${signalsError.message}`
        );
      } else {
        console.log(
          "Traffic signals:",
          signals
        );

        const formattedSignals = (
          signals || []
        ).map((signal, index) => ({
          id: signal.id,

          name:
            signal.signal_name ||
            `Signal ${index + 1}`,

          signal_code:
            signal.signal_code,

          latitude:
            signal.latitude,

          longitude:
            signal.longitude,

          status:
            signal.status,

          distance:
            "On emergency route",
        }));

        setTrafficSignals(
          formattedSignals
        );
      }
    } catch (error) {
      console.error(
        "Dashboard error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Something went wrong while loading dashboard."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD + REFRESH
  // =========================================================

  useEffect(() => {
    loadDriverData();

    /*
     * Refresh database information every 3 seconds.
     *
     * IMPORTANT:
     * This does NOT clear the route state.
     */

    const interval = setInterval(() => {
      loadDriverData();
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // =========================================================
  // ROUTE STATUS
  // =========================================================

  /*
   * This is the important change.
   *
   * The actual route object is now the primary source.
   */

  const routeAvailable =
    Boolean(route) &&
    Boolean(route.geometry);

  const routeActive =
    routeAvailable ||
    tripActive ||
    Boolean(tripId);

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-slate-100">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <DriverHeader />

      {/* =====================================================
          MAIN LAYOUT
      ===================================================== */}

      <div className="flex">

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <DriverSidebar />

        {/* ===================================================
            MAIN CONTENT
        =================================================== */}

        <main className="flex-1 p-4 md:p-6">

          <div className="max-w-7xl mx-auto">

            {/* =================================================
                TITLE
            ================================================= */}

            <div className="mb-6">

              <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
                Driver Dashboard
              </h1>

              <p className="text-slate-500 mt-1">
                Monitor your ambulance and manage emergency trips.
              </p>

            </div>

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="mb-5 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 text-sm">
                Loading ambulance information...
              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {errorMessage && (
              <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {errorMessage}
              </div>
            )}

            {/* =================================================
                STATUS CARDS
            ================================================= */}

            <StatusCards />

            {/* =================================================
                MAP + EMERGENCY TRIP
            ================================================= */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">

              {/* =================================================
                  LIVE MAP
              ================================================= */}

              <div className="lg:col-span-2">
                <LiveMap />
              </div>

              {/* =================================================
                  EMERGENCY TRIP
              ================================================= */}

              <div>

                <EmergencyTrip
                  onRouteCalculated={
                    handleRouteCalculated
                  }
                />

              </div>

            </div>

            {/* =================================================
                SIGNAL PRIORITY
            ================================================= */}

            <div className="mt-6">

              <SignalPriority
                routeActive={routeActive}
                routeAvailable={routeAvailable}
                route={route}
                ambulanceId={ambulanceId}
                tripId={tripId}
                signals={trafficSignals}
              />

            </div>

            {/* =================================================
                SYSTEM STATUS
            ================================================= */}

            <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">

              <h3 className="font-bold text-lg text-slate-800 mb-4">
                System Status
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* AMBULANCE */}

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                  <p className="text-sm text-slate-500">
                    Ambulance
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">

                    {ambulanceId
                      ? "Connected"
                      : "Not Available"}

                  </p>

                </div>

                {/* TRIP */}

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                  <p className="text-sm text-slate-500">
                    Emergency Trip
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">

                    {routeAvailable
                      ? "Active"
                      : tripActive
                      ? "Active"
                      : "Not Active"}

                  </p>

                </div>

                {/* SIGNALS */}

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">

                  <p className="text-sm text-slate-500">
                    Traffic Signals
                  </p>

                  <p className="font-semibold text-slate-800 mt-1">
                    {trafficSignals.length} signals
                  </p>

                </div>

              </div>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
};

export default DriverDashboard;