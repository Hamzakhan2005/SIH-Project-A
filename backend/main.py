from fastapi import FastAPI, HTTPException, Query
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
from math import radians, sin, cos, sqrt, atan2
from datetime import datetime, timedelta

DB = "db.sqlite"
app=FastAPI()
origins=[
     "http://localhost:5173/"
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
    # 1) get bus current location and route
    r = db_query("SELECT id, route_id, current_lat, current_lng FROM buses WHERE id=?", (bus_id,))
    if not r:
        raise HTTPException(404, "Bus not found")
    bus = r[0]
    bus_lat, bus_lng = bus[2], bus[3]
    route_id = bus[1]

    # 2) find nearest stop on that route to the user (user_stop)
    stops_on_route = db_query("SELECT s.id, s.name, s.lat, s.lng FROM route_stops rs JOIN stops s ON rs.stop_id=s.id WHERE rs.route_id=? ORDER BY rs.stop_order", (route_id,))
    # get the stop closest to user (user will walk to that stop)
    user_stop = min(stops_on_route, key=lambda s: haversine_km(user_lat, user_lng, s[2], s[3]))
    user_stop_id, user_stop_lat, user_stop_lng = user_stop[0], user_stop[2], user_stop[3]

    # 3) estimate walking time from user -> user_stop
    walk_speed_kmph = 5.0
    walk_dist = haversine_km(user_lat, user_lng, user_stop_lat, user_stop_lng)
    walking_minutes = (walk_dist / walk_speed_kmph) * 60

    # 4) estimate bus travel distance from current bus pos -> user_stop (approx via straight-line)
    bus_to_stop_km = haversine_km(bus_lat, bus_lng, user_stop_lat, user_stop_lng)

    # 5) traffic multiplier based on now
    now = datetime.now()
    multiplier = time_of_day_multiplier(now)
    base_speed_kmph = 25.0  # base bus speed
    effective_speed = base_speed_kmph * multiplier  # slower when multiplier<1
    travel_minutes = (bus_to_stop_km / effective_speed) * 60

    # 6) delay due to traffic: compute difference between travel time with multiplier and without
    normal_speed = base_speed_kmph
    normal_minutes = (bus_to_stop_km / normal_speed) * 60
    delay_minutes = max(0.0, travel_minutes - normal_minutes)

    total_eta_minutes = travel_minutes + (walking_minutes if include_walking else 0)
    eta_time = (now + timedelta(minutes=total_eta_minutes)).strftime("%H:%M:%S")

    return ETAResponse(
        bus_id=bus[0],
        route_id=route_id,
        eta_minutes=round(total_eta_minutes, 2),
        eta_time=eta_time,
        walking_minutes=round(walking_minutes, 2),
        distance_km=round(bus_to_stop_km, 3),
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