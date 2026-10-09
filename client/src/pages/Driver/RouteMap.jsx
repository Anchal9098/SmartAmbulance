import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

const RouteMap = ({ currentLocation, destination }) => {
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current).setView(
      [21.1458, 79.0882],
      13
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution: "&copy; OpenStreetMap contributors",
      }
    ).addTo(map);

    routingControlRef.current = L.Routing.control({
      waypoints: [],
      routeWhileDragging: false,
      addWaypoints: false,
      draggableWaypoints: false,
      show: false,
      createMarker: () => null,
    }).addTo(map);

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current);
        routingControlRef.current = null;
      }

      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (
      !currentLocation ||
      !destination ||
      !routingControlRef.current
    ) {
      return;
    }

    const start = L.latLng(
      currentLocation.lat,
      currentLocation.lng
    );

    const end = L.latLng(
      destination.lat,
      destination.lng
    );

    routingControlRef.current.setWaypoints([
      start,
      end,
    ]);
  }, [currentLocation, destination]);

  return (
    <div
      ref={mapRef}
      className="w-full h-full"
    />
  );
};

export default RouteMap;