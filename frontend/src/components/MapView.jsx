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
  iconUrl: "https://cdn-icons-png.flaticon.com/512/422/422962.png", // 🚌 proper bus icon
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
  buses = [],
  nearestStop = null,
  walkingInfo = null,
}) => {
  const [busPositions, setBusPositions] = useState({});
  const [walkingPath, setWalkingPath] = useState([]);
  const [selectedBusRoute, setSelectedBusRoute] = useState([]);
  const [selectedBusInfo, setSelectedBusInfo] = useState(null);

  // init bus positions
  useEffect(() => {
    const init = {};
    buses.forEach((b) => (init[b.id] = 0));
    setBusPositions(init);
  }, [buses]);

  // animate buses
  useEffect(() => {
    const interval = setInterval(() => {
      setBusPositions((prev) => {
        const next = { ...prev };
        buses.forEach((bus) => {
          const route = bus.route_coords?.length
            ? bus.route_coords
            : [[bus.current_lat, bus.current_lng]];
          const len = route.length;
          if (!len) return;
          const cur = prev[bus.id] ?? 0;
          next[bus.id] = (cur + 1) % len;
        });
        return next;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [buses]);

  // compute walking path (OSRM)
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
      }
    };
    fetchWalkingRoute();
  }, [userLocation, nearestStop]);

  const onBusClick = async (bus) => {
    setSelectedBusInfo(bus);
    if (bus.route_coords?.length) {
      setSelectedBusRoute(bus.route_coords);
    }
    try {
      const res = await api.get("/eta-to-user", {
        params: {
          bus_id: bus.id,
          user_lat: userLocation.lat,
          user_lng: userLocation.lng,
        },
      });
      setSelectedBusInfo({ ...bus, eta: res.data });
    } catch (err) {
      console.error("ETA fetch error", err);
    }
  };

  const getBusPosition = (bus) => {
    const route = bus.route_coords?.length
      ? bus.route_coords
      : [[bus.current_lat, bus.current_lng]];
    const idx = busPositions[bus.id] ?? 0;
    return route[idx] || route[0];
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

      {/* walking path */}
      {walkingPath.length > 0 && (
        <Polyline positions={walkingPath} dashArray="6,8" color="purple" />
      )}

      {/* selected bus route */}
      {selectedBusRoute.length > 0 && (
        <Polyline positions={selectedBusRoute} color="blue" weight={4} />
      )}

      {/* bus markers */}
      {buses.map((bus) => {
        const pos = getBusPosition(bus);
        return (
          <Marker
            key={bus.id}
            position={pos}
            icon={busIcon}
            eventHandlers={{ click: () => onBusClick(bus) }}
          >
            <Popup>
              <div>
                <div>
                  <strong>Bus #{bus.id}</strong>
                </div>
                <div>Route: {bus.route_id}</div>
                {selectedBusInfo?.id === bus.id && (
                  <div>
                    ETA: ~10 min <br />
                    Fare: ₹20
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* stops */}
      {stops.map((stop) => (
        <Marker key={stop.id} position={[stop.lat, stop.lng]}>
          <Popup>{stop.name}</Popup>
        </Marker>
      ))}

      {/* nearest stop */}
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

      {/* user */}
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
