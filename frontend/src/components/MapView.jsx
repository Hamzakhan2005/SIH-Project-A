import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import api from "../api";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Default icon fix for leaflet in React
import "leaflet/dist/leaflet.css";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
const userIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/blue-dot.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const MapView = ({ userLocation, mapRef }) => {
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState(null);
  const [routeCoords, setRouteCoords] = useState([]);

  useEffect(() => {
    // Fetch all bus stops
    api.get("/bus-stops").then((res) => setStops(res.data));
  }, []);

  const fetchNearbyBuses = async () => {
    if (!userLocation) return;
    const { lat, lng } = userLocation;
    const res = await api.get(
      `/buses-near-me?lat=${lat}&lng=${lng}&radius_km=3`
    );
    setBuses(res.data);
  };

  const fetchBusRoute = async (bus) => {
    setSelectedBus(bus);
    // For simplicity, request route from backend using route_id
    const res = await api.get("/bus-routes");
    const route = res.data.find((r) => r.id === bus.route_id);
    if (route) {
      const coords = [];
      for (let stopId of route.stop_order) {
        const stop = stops.find((s) => s.id === stopId);
        if (stop) coords.push([stop.lat, stop.lng]);
      }
      setRouteCoords(coords);
    }
  };
  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.setView([userLocation.lat, userLocation.lng], 15);
    }
  }, [userLocation]);

  return (
    <MapContainer
      center={
        userLocation ? [userLocation.lat, userLocation.lng] : [26.85, 80.95]
      }
      zoom={13}
      style={{ height: "400px", width: "100%" }}
      whenCreated={(mapInstance) => {
        mapRef.current = mapInstance;
      }}
    >
      {/* Map tiles */}
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OSM</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* Bus stops */}
      {stops.map((stop) => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}

      {/* Nearby buses */}
      {buses.map((bus) => (
        <Marker
          key={bus.id}
          position={[bus.lat, bus.lng]}
          eventHandlers={{
            click: () => fetchBusRoute(bus),
          }}
        >
          <Popup>Bus #{bus.id}</Popup>
        </Marker>
      ))}

      {/* Selected bus route */}
      {routeCoords.length > 0 && (
        <Polyline positions={routeCoords} color="blue" />
      )}
    </MapContainer>
  );
};

export default MapView;
