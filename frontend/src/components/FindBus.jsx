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
import {
  Search,
  MapPin,
  Mic,
  User,
  ChevronDown,
  Clock,
  Bus,
} from "lucide-react";

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
        const res = await api.get(
          `/stop-schedule/${nearest.id}?window_minutes=30&user_lat=${userLocation.lat}&user_lng=${userLocation.lng}`
        );

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
      <div className="w-[98vw] h-[150vh] p-[1vh_1vw] flex flex-col items-center bg-[#1a1a1a]">
        {/* Header with Search */}
        <div className="flex items-center justify-between w-[100%] max-w-[1200px] mb-[24px] px-[24px] py-[16px]">
          <div className="flex-[1] max-w-[400px] mx-[24px]">
            <div className="relative">
              <Search className="absolute left-[12px] top-[50%] transform -translate-y-[50%] text-[#6b7280] w-[20px] h-[20px]" />
              <input
                type="text"
                placeholder="Enter route, stop, or destination..."
                className="w-[100%] pl-[40px] pr-[16px] py-[12px] bg-[#2a2a2a] border border-[#404040] rounded-[50px] text-[#ffffff] placeholder-[#6b7280] focus:outline-none focus:ring-[2px] focus:ring-[#10b981]"
              />
              <Mic className="absolute right-[12px] top-[50%] transform -translate-y-[50%] text-[#6b7280] w-[20px] h-[20px] cursor-pointer hover:text-[#10b981]" />
            </div>
          </div>
          <button
            onClick={handleLocate}
            className="bg-[#10b981] hover:bg-[#059669] text-[#ffffff] px-[20px] py-[10px] rounded-[8px] font-[500] text-[14px] transition-colors flex items-center gap-[8px]"
          >
            <MapPin className="w-[16px] h-[16px]" />
            Location
          </button>
          <button
            onClick={() => navigate("/voice")}
            className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-[#ffffff] px-[20px] py-[10px] rounded-[8px] font-[500] text-[14px] transition-colors border border-[#404040] flex items-center gap-[8px]"
          >
            <Mic className="w-[16px] h-[16px]" />
            Use Voice Assistant
          </button>
        </div>

        {/* Main Content */}
        <div className="w-[80%] flex justify-between mt-[2vh] gap-[24px] max-w-[1200px]">
          {/* Left Section */}
          <div className="w-[35%] flex flex-col gap-[16px]">
            {/* Nearest Bus Stop Card */}
            <div className="bg-[#2a2a2a] p-[20px] rounded-[12px] border border-[#404040]">
              <div className="flex items-center justify-between mb-[12px]">
                <h2 className="text-[#ffffff] text-[18px] font-[600]">
                  Nearest bus stop
                </h2>
                <button className="text-[#6b7280] hover:text-[#10b981] text-[12px]">
                  See all stops
                </button>
              </div>

              {nearestStop ? (
                <div className="bg-[#1a1a1a] p-[16px] rounded-[8px] border border-[#404040] mb-[16px]">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-[8px]">
                      <MapPin className="w-[16px] h-[16px] text-[#10b981] flex-shrink-0 mt-[2px]" />
                      <div>
                        <p className="text-[#ffffff] font-[600] text-[14px] mb-[4px]">
                          {nearestStop.name}
                        </p>
                        <p className="text-[#6b7280] text-[12px] mb-[2px]">
                          Distance: {walkingInfo?.distance_km} km
                        </p>
                        <p className="text-[#6b7280] text-[12px]">
                          Walking ETA: {walkingInfo?.walking_minutes} min
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-[#6b7280] text-[14px]">
                  Click Location to find nearest stop
                </p>
              )}
            </div>

            {/* Bottom Cards */}
            <div className="grid grid-cols-2 gap-[12px]">
              <div className="bg-[#2a2a2a] p-[16px] rounded-[8px] border border-[#404040]">
                <div className="w-[32px] h-[32px] bg-[#10b981] rounded-[8px] flex items-center justify-center mb-[8px]">
                  <span className="text-[#ffffff] text-[12px] font-[600]">
                    U
                  </span>
                </div>
                <h4 className="text-[#ffffff] text-[12px] font-[600] mb-[4px]">
                  Update
                </h4>
                <p className="text-[#6b7280] text-[10px] leading-[1.3]">
                  Connect with your colleagues within the app now!
                </p>
              </div>

              <div className="bg-[#2a2a2a] p-[16px] rounded-[8px] border border-[#404040]">
                <div className="w-[32px] h-[32px] bg-[#dc2626] rounded-[8px] flex items-center justify-center mb-[8px]">
                  <span className="text-[#ffffff] text-[12px] font-[600]">
                    T
                  </span>
                </div>
                <h4 className="text-[#ffffff] text-[12px] font-[600] mb-[4px]">
                  Tips
                </h4>
                <p className="text-[#6b7280] text-[10px] leading-[1.3]">
                  Reserve your desk prior to others!
                </p>
              </div>
            </div>

            {/* Arrivals List */}
            <div className="bg-[#2a2a2a] p-[20px] rounded-[12px] border border-[#404040] h-[45vh] overflow-auto">
              <h3 className="text-[#ffffff] text-[16px] font-[600] mb-[16px] flex items-center gap-[8px]">
                <Clock className="w-[16px] h-[16px] text-[#10b981]" />
                Arrivals
              </h3>
              {loadingArrivals ? (
                <p className="text-[#6b7280] text-[14px]">Loading...</p>
              ) : (
                <div className="space-y-[12px]">
                  {arrivals.length === 0 ? (
                    <p className="text-[#6b7280] text-[14px]">No arrivals</p>
                  ) : (
                    arrivals.map((a, idx) => (
                      <div
                        key={idx}
                        className="p-[12px] bg-[#1a1a1a] rounded-[8px] border border-[#404040]"
                      >
                        <div className="flex items-center justify-between mb-[4px]">
                          <span className="text-[#ffffff] font-[600] text-[14px]">
                            Bus #{a.bus_id}
                          </span>
                          <span className="text-[#10b981] text-[12px] font-[500]">
                            {a.eta_minutes} min away
                          </span>
                        </div>
                        <p className="text-[#6b7280] text-[12px] mb-[2px]">
                          Route {a.route_id}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-[#6b7280] text-[12px]">
                            Scheduled: {a.scheduled_time}
                          </span>
                          <span className="text-[#f59e0b] text-[12px] font-[500]">
                            ₹{a.fare_inr}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          <div
            style={{
              width: "100%",
              height: "55vh",
              borderRadius: 10,
              overflow: "hidden",
            }}
            className="rounded-lg"
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
      <Footer />
    </div>
  );
};

export default FindBus;
