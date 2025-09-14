from fastapi import FastAPI, HTTPException, Query
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from math import radians, sin, cos, sqrt, atan2
from datetime import datetime, timedelta
import asyncio
import threading
import requests   
import json, time
live_state = {} 

DB = "db.sqlite"
conn_bg = sqlite3.connect(DB, check_same_thread=False, timeout=30)
cur_bg = conn_bg.cursor()
cur_bg.execute("PRAGMA journal_mode=WAL;")

# lock so only one thread writes at a time
db_lock = threading.Lock()
app=FastAPI()
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
    # "https://sih-project-a.vercel.app"
]


# ---------- Pydantic models ----------
class Stop(BaseModel):
    id: int
    name: str
    lat: float
    lng: float

class Route(BaseModel):
    id: int
    name: str
    stops: List[int]

class Bus(BaseModel):
    id: int
    route_id: int
    current_lat: float
    current_lng: float

class ETAResponse(BaseModel):
    bus_id: int
    route_id: int
    eta_minutes: float
    eta_time: str
    walking_minutes: float
    distance_km: float
    delay_minutes_due_to_traffic: float

# ---------- helper functions ----------
def db_query(sql, params=()):
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute(sql, params)
    rows = cur.fetchall()
    conn.close()
    return rows

def haversine_km(lat1, lon1, lat2, lon2):
    # returns distance in km between two lat/lon points
    R = 6371.0
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
    c = 2*atan2(sqrt(a), sqrt(1-a))
    return R * c

def interpolate_coords(lat1, lng1, lat2, lng2, fraction):
    """Return a point fraction (0-1) along the line from (lat1,lng1) to (lat2,lng2)."""
    lat = lat1 + (lat2 - lat1) * fraction
    lng = lng1 + (lng2 - lng1) * fraction
    return lat, lng


def time_of_day_multiplier(dt: datetime):
    # your traffic multipliers (tweakable)
    h = dt.hour
    if 7 <= h < 10:
        return 0.7
    if 17 <= h < 20:
        return 0.6
    if 10 <= h < 16:
        return 0.9
    return 1.0

async def move_buses():
    poll_seconds = 1  # smaller interval for smooth movement
    bus_speed_kmph = 25.0

    while True:
        now = datetime.now()
        for bus_id, st in list(live_state.items()):
            coords = st.get("coords", [])
            if len(coords) < 2:
                continue

            idx = st["idx"]
            next_idx = (idx + 1) % len(coords)

            lat1, lng1 = coords[idx]
            lat2, lng2 = coords[next_idx]

            # distance between stops
            dist_km = haversine_km(lat1, lng1, lat2, lng2)
            # distance covered per poll
            fraction = (bus_speed_kmph / 3600) * poll_seconds / dist_km  # km/sec / distance
            fraction = min(fraction, 1.0)

            # interpolate position
            new_lat, new_lng = interpolate_coords(lat1, lng1, lat2, lng2, fraction)

            # if reached next stop, update idx
            if fraction >= 1.0:
                idx = next_idx

            live_state[bus_id].update({"lat": new_lat, "lng": new_lng, "idx": idx})

        await asyncio.sleep(poll_seconds)


@app.on_event("startup")
def startup_tasks():
    global live_state

    # Use the same function that builds coords dynamically
    buses_data = all_buses()

    for bus in buses_data:
        coords = bus["route_coords"]
        if not coords:
            continue
        live_state[bus["id"]] = {
            "lat": coords[0][0],
            "lng": coords[0][1],
            "idx": 0,
            "coords": coords
        }

    # start background simulator
    def start_loop(loop):
        asyncio.set_event_loop(loop)
        loop.run_until_complete(move_buses())

    loop = asyncio.new_event_loop()
    t = threading.Thread(target=start_loop, args=(loop,), daemon=True)
    t.start()



def start_background_loop(loop):
    asyncio.set_event_loop(loop)
    loop.run_until_complete(move_buses())



app.add_middleware(
     CORSMiddleware,
     allow_origins=origins,
     allow_credentials=True,
     allow_methods=["*"],
     allow_headers=["*"],
)

@app.get("/")
def root():
     return {"Hello":"Hamza"}


# ---------- endpoints ----------
@app.get("/bus-stops", response_model=List[Stop])
def get_stops():
    rows = db_query("SELECT id, name, lat, lng FROM stops")
    return [Stop(id=r[0], name=r[1], lat=r[2], lng=r[3]) for r in rows]

@app.get("/live-buses")
def get_live_buses():
    return [
        {
            "id": bid,
            "lat": st["lat"],
            "lng": st["lng"],
            "route_coords": st["coords"]  # include full route for frontend
        }
        for bid, st in live_state.items()
    ]

@app.get("/bus-routes")
def get_routes():
    # returns routes with list of stop ids
    rows = db_query("SELECT id, name FROM routes")
    routes = []
    for r in rows:
        rs = db_query("SELECT stop_id FROM route_stops WHERE route_id=? ORDER BY stop_order", (r[0],))
        stops = [s[0] for s in rs]
        routes.append({"id": r[0], "name": r[1], "stops": stops})
    return routes

@app.get("/buses-at-stop/{stop_id}", response_model=List[Bus])
def buses_at_stop(stop_id: int):
    # 1. Find all route IDs that include this stop
    route_rows = db_query("SELECT route_id FROM route_stops WHERE stop_id=?", (stop_id,))
    if not route_rows:
        raise HTTPException(404, f"No routes found for stop {stop_id}")
    route_ids = [r[0] for r in route_rows]

    # 2. Get buses running on those routes
    buses_rows = db_query(
        f"SELECT id, route_id, current_lat, current_lng FROM buses WHERE route_id IN ({','.join(['?']*len(route_ids))})",
        tuple(route_ids)
    )

    return [Bus(id=r[0], route_id=r[1], current_lat=r[2], current_lng=r[3]) for r in buses_rows]

import requests

@app.get("/all-buses")
def all_buses():
    return [
        {
            "id": bid,
            "lat": st["lat"],
            "lng": st["lng"],
            "route_coords": st["coords"]
        }
        for bid, st in live_state.items()
    ]




@app.get("/stop-schedule/{stop_id}")
def stop_schedule(stop_id: int):
    now = datetime.now()
    results = []

    # Routes passing through this stop
    route_rows = db_query("SELECT DISTINCT route_id FROM route_stops WHERE stop_id=?", (stop_id,))
    if not route_rows:
        return {"stop_id": stop_id, "arrivals": []}

    route_ids = [r[0] for r in route_rows]

    # Stop coordinates
    stop_row = db_query("SELECT id, lat, lng FROM stops WHERE id=?", (stop_id,))
    if not stop_row:
        raise HTTPException(404, "Stop not found")
    _, stop_lat, stop_lng = stop_row[0]

    for route_id in route_ids:
        buses = db_query("SELECT id, current_lat, current_lng FROM buses WHERE route_id=?", (route_id,))
        for bus_id, bus_lat, bus_lng in buses:

            # Use straight-line distance for ETA
            road_distance_km = haversine_km(bus_lat, bus_lng, stop_lat, stop_lng)

            # travel time
            multiplier = time_of_day_multiplier(now)
            base_speed_kmph = 25.0
            effective_speed = base_speed_kmph * multiplier
            travel_minutes = (road_distance_km / effective_speed) * 60

            eta_time = (now + timedelta(minutes=travel_minutes)).strftime("%H:%M:%S")

            results.append({
                "bus_id": bus_id,
                "route_id": route_id,
                "stop_id": stop_id,
                "eta_minutes": round(travel_minutes, 2),
                "eta_time": eta_time,
                "distance_km": round(road_distance_km, 2),
                "fare_inr": 10
            })

        # Optional: include scheduled departures
        sched_rows = db_query("SELECT departure_time FROM schedules WHERE route_id=? ORDER BY departure_time ASC", (route_id,))
        for (dep_time_str,) in sched_rows:
            results.append({
                "bus_id": None,
                "route_id": route_id,
                "stop_id": stop_id,
                "scheduled_time": dep_time_str,
                "eta_minutes": None,
                "eta_time": None,
                "distance_km": None,
                "fare_inr": 10
            })

    # Sort soonest ETA first
    results.sort(key=lambda x: x["eta_minutes"] if x["eta_minutes"] is not None else 99999)
    return {"stop_id": stop_id, "arrivals": results}





@app.get("/buses-near-me", response_model=List[Bus])
def buses_near_me(lat: float = Query(...), lng: float = Query(...), radius_km: float = 2.0):
    # returns buses whose current position is within radius_km of (lat,lng)
    rows = db_query("SELECT id, route_id, current_lat, current_lng FROM buses")
    out = []
    for r in rows:
        dist = haversine_km(lat, lng, r[2], r[3])
        if dist <= radius_km:
            out.append(Bus(id=r[0], route_id=r[1], current_lat=r[2], current_lng=r[3]))
    return out

@app.get("/eta-to-user", response_model=ETAResponse)
def eta_to_user(bus_id: int, user_lat: float, user_lng: float, include_walking: Optional[bool] = True):
    r = db_query("SELECT id, route_id, current_lat, current_lng FROM buses WHERE id=?", (bus_id,))
    if not r:
        raise HTTPException(404, "Bus not found")
    bus = r[0]
    bus_lat, bus_lng = bus[2], bus[3]
    route_id = bus[1]

    # get nearest stop to user
    stops_on_route = db_query("SELECT s.id, s.name, s.lat, s.lng FROM route_stops rs JOIN stops s ON rs.stop_id=s.id WHERE rs.route_id=? ORDER BY rs.stop_order", (route_id,))
    user_stop = min(stops_on_route, key=lambda s: haversine_km(user_lat, user_lng, s[2], s[3]))
    user_stop_id, user_stop_lat, user_stop_lng = user_stop[0], user_stop[2], user_stop[3]

    # Walking ETA (haversine is okay here)
    walk_speed_kmph = 5.0
    walk_dist = haversine_km(user_lat, user_lng, user_stop_lat, user_stop_lng)
    walking_minutes = (walk_dist / walk_speed_kmph) * 60 if include_walking else 0

    # --- Use OSRM Driving for Bus Route ---
    try:
        url = f"http://router.project-osrm.org/route/v1/driving/{bus_lng},{bus_lat};{user_stop_lng},{user_stop_lat}?overview=false"
        res = requests.get(url).json()
        if res.get("routes"):
            road_distance_km = res["routes"][0]["distance"] / 1000.0
        else:
            road_distance_km = haversine_km(bus_lat, bus_lng, user_stop_lat, user_stop_lng)  # fallback
    except Exception:
        road_distance_km = haversine_km(bus_lat, bus_lng, user_stop_lat, user_stop_lng)

    # Apply traffic + speed
    now = datetime.now()
    multiplier = time_of_day_multiplier(now)
    base_speed_kmph = 25.0
    effective_speed = base_speed_kmph * multiplier
    travel_minutes = (road_distance_km / effective_speed) * 60

    # delay compared to normal
    normal_minutes = (road_distance_km / base_speed_kmph) * 60
    delay_minutes = max(0.0, travel_minutes - normal_minutes)

    total_eta_minutes = travel_minutes + walking_minutes
    eta_time = (now + timedelta(minutes=total_eta_minutes)).strftime("%H:%M:%S")

    return ETAResponse(
        bus_id=bus[0],
        route_id=route_id,
        eta_minutes=round(total_eta_minutes, 2),
        eta_time=eta_time,
        walking_minutes=round(walking_minutes, 2),
        distance_km=round(road_distance_km, 3),
        delay_minutes_due_to_traffic=round(delay_minutes, 2)
    )

@app.get("/schedule/{route_id}")
def get_schedule(route_id: int):
    rows = db_query("SELECT departure_time FROM schedules WHERE route_id=? ORDER BY departure_time", (route_id,))
    return {"route_id": route_id, "schedule": [r[0] for r in rows]}

@app.get("/fares")
def get_fare(start_lat: float, start_lng: float, end_lat: float, end_lng: float):
    dist = haversine_km(start_lat, start_lng, end_lat, end_lng)
    base_fare = 10.0
    per_km = 2.0
    # round distance to nearest 0.5 km
    rounded_km = round(dist * 2) / 2.0
    fare = base_fare + per_km * rounded_km
    return {"distance_km": round(dist, 3), "fare_inr": round(fare, 2), "rounded_km": rounded_km}

if __name__ == "__main__":
     uvicorn.run(app,host="0.0.0.0",port=8080)