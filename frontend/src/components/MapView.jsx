import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import api from "../api.js";

// fix default leaflet marker
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// custom icons
const userIcon = new L.Icon({
  iconUrl: "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png",
  iconSize: [28, 28],
  iconAnchor: [14, 28],
});

const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/422/422962.png",
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -30],
});

const RecenterMap = ({ userLocation }) => {
  const map = useMap();
  useEffect(() => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 15, {
        animate: true,
        duration: 1.2,
      });
    }
  }, [userLocation, map]);
  return null;
};

const MapView = ({
  userLocation,
  stops = [],
  nearestStop = null,
  walkingInfo = null,
}) => {
  const [liveBuses, setLiveBuses] = useState([]);
  const [selectedBusInfo, setSelectedBusInfo] = useState(null);
  const [selectedBusRoute, setSelectedBusRoute] = useState([]);

  // Poll live buses every 5s
  useEffect(() => {
    let mounted = true;
    const fetchLiveBuses = async () => {
      try {
        const res = await api.get("/live-buses");
        if (!mounted) return;
        setLiveBuses(res.data);
      } catch (err) {
        console.error("Fetch /live-buses error:", err);
      }
    };
    fetchLiveBuses();
    const interval = setInterval(fetchLiveBuses, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);
  // compute walking path (OSRM) from user to nearest stop
  const [walkingPath, setWalkingPath] = useState([]);

  useEffect(() => {
    const fetchWalkingRoute = async () => {
      if (!userLocation || !nearestStop) {
        setWalkingPath([]);
        return;
      }
      try {
        const url = `https://router.project-osrm.org/route/v1/foot/${userLocation.lng},${userLocation.lat};${nearestStop.lng},${nearestStop.lat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.length) {
          const coords = data.routes[0].geometry.coordinates.map(
            ([lng, lat]) => [lat, lng]
          );
          setWalkingPath(coords);
        }
      } catch (e) {
        console.error("OSRM walking error:", e);
        setWalkingPath([]);
      }
    };
    fetchWalkingRoute();
  }, [userLocation, nearestStop]);

  const onBusClick = (bus) => {
  setSelectedBusInfo(bus);
  if (bus.route_coords) {
    setSelectedBusRoute(bus.route_coords); // highlight the path
  }
};


  return (
    <MapContainer
      center={
        userLocation ? [userLocation.lat, userLocation.lng] : [26.85, 80.95]
      }
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <RecenterMap userLocation={userLocation} />
      {walkingPath.length > 0 && (
        <Polyline positions={walkingPath} dashArray="6,8" color="purple" />
      )}
      {/* Selected bus route */}
      {selectedBusRoute.length > 0 && (
        <Polyline positions={selectedBusRoute} color="blue" weight={4} />
      )}

      {/* Bus markers */}
      {liveBuses.map((bus) => (
        <Marker
          key={bus.id}
          position={[bus.lat, bus.lng]}
          icon={busIcon}
          eventHandlers={{ click: () => onBusClick(bus) }}
        >
          <Popup>
            <div>
              <strong>Bus #{bus.id}</strong>
              <div>Route: {bus.route_id}</div>
              {selectedBusInfo?.id === bus.id && selectedBusInfo.eta && (
                <div>
                  ETA: ~{Math.round(selectedBusInfo.eta.eta_minutes)} min <br />
                  Fare: ₹{selectedBusInfo.eta.fare_inr}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Stops */}
      {stops.map((stop) => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}

      {/* Nearest stop */}
      {nearestStop && (
        <Marker position={[nearestStop.lat, nearestStop.lng]}>
          <Popup>
            <div>
              <strong>{nearestStop.name}</strong>
              <div>Distance: {walkingInfo?.distance_km} km</div>
              <div>Walking ETA: {walkingInfo?.walking_minutes} min</div>
            </div>
          </Popup>
        </Marker>
      )}

      {/* User */}
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
          <Popup>You are here</Popup>
        </Marker>
      )}

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OSM"
      />
    </MapContainer>
  );
};

export default MapView;
