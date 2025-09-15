// FindBus.jsx (replace your current FindBus file)
import React from "react";
import Footer from "./Footer";
import Navbar from "./Navbar";
import Button from "@mui/material/Button";
import styled from "styled-components";
import api from "../api.js";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useRef, useState, useEffect } from "react";
import MapView from "./MapView";
import { useNavigate } from "react-router-dom";

import "./FindBus.css";

const FindBus = () => {
  const navigate = useNavigate();
  const [stops, setStops] = useState([]);
  const [buses, setBuses] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [nearestStop, setNearestStop] = useState(null);
  const [walkingInfo, setWalkingInfo] = useState(null); // {distance_km, walking_minutes, path}
  const [arrivals, setArrivals] = useState([]); // arrivals at nearest stop in next 30 min
  const [loadingArrivals, setLoadingArrivals] = useState(false);

  // Fetch stops once
  useEffect(() => {
    (async () => {
      try {
        const stopRes = await api.get("/bus-stops");
        setStops(stopRes.data || []);
      } catch (err) {
        console.error("Error fetching stops:", err);
      }
    })();
  }, []);

  // Fetch all buses initially and then poll every 6 seconds
  useEffect(() => {
    let mounted = true;
    const fetchBuses = async () => {
      try {
        const busRes = await api.get("/all-buses");
        if (!mounted) return;
        // normalize to route_coords: map stop IDs to stop lat/lng
        const busesWithCoords = (busRes.data || []).map((bus) => {
          const route_coords = (bus.route_stops || [])
            .map((stopId) => stops.find((s) => s.id === stopId))
            .filter(Boolean)
            .map((s) => [s.lat, s.lng]);
          return {
            ...bus,
            route_coords,
            current_lat: bus.current_lat,
            current_lng: bus.current_lng,
          };
        });
        setBuses(busesWithCoords);
      } catch (err) {
        console.error("Error fetching buses:", err);
      }
    };

    fetchBuses();
    const interval = setInterval(fetchBuses, 6000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [stops]);

  // locate user and set nearest stop when location known
  const handleLocate = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const user = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(user);
      },
      (err) => alert("Error getting location: " + err.message),
      { enableHighAccuracy: true }
    );
  };

  // compute nearest stop when userLocation or stops change
  useEffect(() => {
    if (!userLocation || stops.length === 0) {
      setNearestStop(null);
      setArrivals([]);
      setWalkingInfo(null);
      return;
    }

    // simple haversine
    const haversine = (lat1, lon1, lat2, lon2) => {
      const R = 6371;
      const toRad = (d) => (d * Math.PI) / 180;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    let nearest = null;
    let minDist = Infinity;
    stops.forEach((s) => {
      const d = haversine(userLocation.lat, userLocation.lng, s.lat, s.lng);
      if (d < minDist) {
        minDist = d;
        nearest = s;
      }
    });

    setNearestStop(nearest);
    // walking speed 5 km/h to compute walking minutes
    const walking_minutes = (minDist / 5) * 60;
    setWalkingInfo({
      distance_km: Number(minDist.toFixed(3)),
      walking_minutes: Number(walking_minutes.toFixed(1)),
    });

    // fetch arrivals for nearest stop
    (async () => {
      if (!nearest) return;
      setLoadingArrivals(true);
      try {
        // call backend endpoint we discussed
        const res = await api.get(
          `/stop-schedule/${nearest.id}?window_minutes=30&user_lat=${userLocation.lat}&user_lng=${userLocation.lng}`
        );
        // expected: { stop_id: ..., arrivals: [...] }
        setArrivals(res.data.arrivals || []);
      } catch (err) {
        console.error("Error fetching arrivals:", err);
        setArrivals([]);
      } finally {
        setLoadingArrivals(false);
      }
    })();
  }, [userLocation, stops]);

  return (
    <div>
      <Navbar />
      <div
        className="homepage-container"
        style={{
          width: "98vw",
          height: "150vh",
          padding: "1vh 1vw",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          background:
            "linear-gradient(to right, #bbe4cb 0%, #ffffff 50%, #f8dbba 100%)",
        }}
      >
        <div
          className="flex items-center justify-center search-bar"
          style={{ marginBottom: 12 }}
        >
          <div style={{ marginRight: 12 }}>
            <input
              placeholder="search..."
              style={{ padding: 10, width: 220 }}
            />
          </div>
          <Button variant="contained" onClick={handleLocate}>
            <LocationOnIcon /> Location
          </Button>
          <Button variant="contained" onClick={() => navigate("/voice")}>
            <LocationOnIcon /> Use Voice Assistant
          </Button>
        </div>

        <div
          style={{
            width: "80%",
            display: "flex",
            justifyContent: "space-between",
            marginTop: "2vh",
          }}
          className="content-section"
        >
          <div
            style={{
              width: "30%",
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
            className="left-section"
          >
            <div
              style={{
                background: "#fff",
                padding: 12,
                borderRadius: 10,
                boxShadow: "0 1px 6px rgba(0,0,0,0.1)",
              }}
              className="arrivals-card"
            >
              <h2>Nearest Bus Stop</h2>
              {nearestStop ? (
                <>
                  <p style={{ margin: 0, fontWeight: 600 }}>
                    {nearestStop.name}
                  </p>
                  <p style={{ margin: 0 }}>
                    Distance: {walkingInfo?.distance_km} km
                  </p>
                  <p style={{ margin: 0 }}>
                    Walking ETA: {walkingInfo?.walking_minutes} min
                  </p>
                </>
              ) : (
                <p>Click Location to find nearest stop</p>
              )}
            </div>

            <div
              style={{
                background: "#fff",
                padding: 12,
                borderRadius: 10,
                height: "45vh",
                overflow: "auto",
              }}
              className="right-section"
            >
              <h3>Arrivals </h3>
              {loadingArrivals ? <p>Loading...</p> : null}
              {!loadingArrivals && arrivals.length === 0 && <p>No arrivals </p>}
              <ul style={{ paddingLeft: 16 }}>
                {arrivals.map((a, idx) => (
                  <li key={idx} style={{ marginBottom: 8 }}>
                    <div>
                      <strong>Bus #{a.bus_id}</strong> (Route {a.route_id})
                    </div>
                    <div>
                      Scheduled: {a.scheduled_time} • ETA: {a.eta_minutes} min •
                      Fare: ₹{a.fare_inr}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            style={{
              width: "65%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            className="map-container"
          >
            <h1>Buses Around You</h1>
            <div
              style={{
                width: "100%",
                height: "55vh",
                borderRadius: 10,
                overflow: "hidden",
              }}
            >
              <MapView
                userLocation={userLocation}
                stops={stops}
                buses={buses}
                nearestStop={nearestStop}
                walkingInfo={walkingInfo}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindBus;
