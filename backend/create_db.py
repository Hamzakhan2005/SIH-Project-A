import sqlite3
from datetime import time, datetime, timedelta

DB = "db.sqlite"

stops = [
    # NOTE: lat/lng are placeholders — later replace with real geocodes if desired.
    (1, "Hazratganj", 26.8467, 80.9462),
    (2, "Charbagh (Railway Station)", 26.8570, 80.9143),
    (3, "Alambagh", 26.8460, 80.9180),
    (4, "Aminabad", 26.8526, 80.9476),
    (5, "Gomti Nagar", 26.8600, 81.0080),
    (6, "Indira Nagar", 26.8700, 81.0200),
    (7, "Lucknow University", 26.8510, 80.9120),
    (8, "Kaiserbagh", 26.8495, 80.9261),
    (9, "Mahanagar", 26.8650, 80.9790),
    (10, "Hazratganj Chowk", 26.8469, 80.9468),
    (11, "Station Road", 26.8575, 80.9150),
    (12, "Chowk", 26.8473, 80.9410),
    (13, "Kakori Road", 26.8920, 80.9160),
    (14, "Gurudwara Shaheed Ganj", 26.8535, 80.9380),
    (15, "Charbagh Bus Stand", 26.8565, 80.9140),
    (16, "Airport (Amausi)", 26.7606, 81.0952),
    (17, "BBD Crossing", 26.8592, 80.9764),
    (18, "Rumi Gate", 26.8662, 80.9320),
    (19, "Malhaur", 26.9180, 80.8450),
    (20, "Rajajipuram", 26.8925, 80.8880),
]

# Create 10 demo routes (point-to-point). Each route is a list of stop IDs in order.
routes = [
    (1, "R1-Hazratganj→GomtiNagar", [1, 10, 4, 9, 5]),
    (2, "R2-Charbagh→Airport", [2, 11, 15, 16]),
    (3, "R3-Alambagh→IndiraNagar", [3, 8, 7, 6]),
    (4, "R4-Aminabad→BBD", [4, 12, 14, 17]),
    (5, "R5-Gomti→Rajajipuram", [5, 9, 17, 20]),
    (6, "R6-Charbagh→Hazratganj", [2, 11, 1]),
    (7, "R7-Kakori→Mahanagar", [13, 3, 9]),
    (8, "R8-Hazratganj→Airport", [1, 12, 15, 16]),
    (9, "R9-StationRoad→IndiraNagar", [11, 7, 6]),
    (10, "R10-RumiGate→Malhaur", [18, 14, 19]),
]

# Buses: assign 1-2 static buses per route with current position near the first stop
buses = []
bus_id = 1
for r_id, name, stop_list in routes:
    for i in range(1, 3):  # 2 buses per route
        first_stop = next(s for s in stops if s[0] == stop_list[0])
        # place bus a tiny bit offset from first stop
        lat = first_stop[2] + 0.001 * i
        lng = first_stop[3] + 0.001 * i
        buses.append((bus_id, r_id, lat, lng))
        bus_id += 1

def hhmm_iter(start_h=6, end_h=22, interval_minutes=30):
    t = datetime(2000,1,1, start_h, 0)
    end = datetime(2000,1,1, end_h, 0)
    while t <= end:
        yield t.time().strftime("%H:%M")
        t += timedelta(minutes=interval_minutes)

def create_db():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    # Drop tables if exist
    cur.executescript("""
    DROP TABLE IF EXISTS stops;
    DROP TABLE IF EXISTS routes;
    DROP TABLE IF EXISTS route_stops;
    DROP TABLE IF EXISTS buses;
    DROP TABLE IF EXISTS schedules;
    """)
    # Create tables
    cur.executescript("""
    CREATE TABLE stops (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL
    );
    CREATE TABLE routes (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL
    );
    CREATE TABLE route_stops (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id INTEGER NOT NULL,
        stop_id INTEGER NOT NULL,
        stop_order INTEGER NOT NULL,
        FOREIGN KEY(route_id) REFERENCES routes(id),
        FOREIGN KEY(stop_id) REFERENCES stops(id)
    );
    CREATE TABLE buses (
        id INTEGER PRIMARY KEY,
        route_id INTEGER NOT NULL,
        current_lat REAL NOT NULL,
        current_lng REAL NOT NULL,
        FOREIGN KEY(route_id) REFERENCES routes(id)
    );
    CREATE TABLE schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id INTEGER NOT NULL,
        departure_time TEXT NOT NULL,
        FOREIGN KEY(route_id) REFERENCES routes(id)
    );
    """)
    # Insert stops
    cur.executemany("INSERT INTO stops (id, name, lat, lng) VALUES (?, ?, ?, ?);", stops)
    # Insert routes and route_stops
    for r_id, r_name, stop_list in routes:
        cur.execute("INSERT INTO routes (id, name) VALUES (?, ?);", (r_id, r_name))
        for order, stop_id in enumerate(stop_list, start=1):
            cur.execute("INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES (?, ?, ?);", (r_id, stop_id, order))
    # Insert buses
    cur.executemany("INSERT INTO buses (id, route_id, current_lat, current_lng) VALUES (?, ?, ?, ?);", buses)
    # Insert schedules (every 30 minutes by default)
    for r_id, _, _ in routes:
        for tstr in hhmm_iter(6, 22, 30):
            cur.execute("INSERT INTO schedules (route_id, departure_time) VALUES (?, ?);", (r_id, tstr))
    conn.commit()
    conn.close()
    print("DB created at", DB)

if __name__ == "__main__":
    create_db()