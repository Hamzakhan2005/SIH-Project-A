# ---------------- DB Generation ----------------
import sqlite3
from datetime import datetime, timedelta

DB = "db.sqlite"

stops = [
    (1, "Hazratganj", 26.8467, 80.9462),
    (2, "Charbagh Railway Station", 26.8570, 80.9143),
    (3, "Alambagh", 26.8460, 80.9180),
    (4, "Aminabad", 26.8526, 80.9476),
    (5, "Gomti Nagar", 26.8600, 81.0080),
    (6, "Indira Nagar", 26.8700, 81.0200),
    (7, "Lucknow University", 26.8510, 80.9120),
    (8, "Kaiserbagh", 26.8495, 80.9261),
    (9, "Mahanagar", 26.8650, 80.9790),
    (10, "Airport (Amausi)", 26.7606, 80.8890),
    (11, "Kursi Road (Scorpio Club)", 26.9360, 80.9620),
    (12, "Chinhat", 26.8800, 81.0500),
    (13, "Amity University", 26.9040, 81.0300),
    (14, "Rajajipuram", 26.8925, 80.8880),
    (15, "Gomti Nagar Extension", 26.8720, 81.0400),
    (16, "BBD University Crossing", 26.8592, 81.0300),
    (17, "Malhaur", 26.9180, 81.0800),
    (18, "Rumi Gate", 26.8662, 80.9320),
    (19, "Chowk", 26.8710, 80.9300),
    (20, "Telibagh", 26.7830, 80.9400),
]

# ---------------- Generate buses ----------------
NUM_BUSES = len(stops)  # 1 bus per stop
buses = []

for i, s in enumerate(stops):
    bus_id = i + 1
    # cyclic route starting from this stop
    route_stops = stops[i:] + stops[:i]
    buses.append({
        "bus_id": bus_id,
        "start_stop_id": s[0],
        "route_stops": [st[0] for st in route_stops]
    })

def hhmm_iter(start_h=6, end_h=22, interval_minutes=30):
    t = datetime(2000, 1, 1, start_h, 0)
    end = datetime(2000, 1, 1, end_h, 0)
    while t <= end:
        yield t.time().strftime("%H:%M")
        t += timedelta(minutes=interval_minutes)

def create_db():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()

    cur.executescript("""
    DROP TABLE IF EXISTS stops;
    DROP TABLE IF EXISTS routes;
    DROP TABLE IF EXISTS route_stops;
    DROP TABLE IF EXISTS buses;
    DROP TABLE IF EXISTS schedules;
    """)

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
        stop_order INTEGER NOT NULL
    );
    CREATE TABLE buses (
        id INTEGER PRIMARY KEY,
        route_id INTEGER NOT NULL,
        current_lat REAL NOT NULL,
        current_lng REAL NOT NULL
    );
    CREATE TABLE schedules (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        route_id INTEGER NOT NULL,
        departure_time TEXT NOT NULL
    );
    """)

    # Insert stops
    cur.executemany("INSERT INTO stops (id, name, lat, lng) VALUES (?, ?, ?, ?);", stops)

    # Insert buses and routes
    for b in buses:
        route_id = b["bus_id"]
        route_name = f"Bus-{route_id}-Cycle"
        cur.execute("INSERT INTO routes (id, name) VALUES (?, ?);", (route_id, route_name))

        for order, stop_id in enumerate(b["route_stops"], start=1):
            cur.execute("INSERT INTO route_stops (route_id, stop_id, stop_order) VALUES (?, ?, ?);",
                        (route_id, stop_id, order))

        start_stop = next(s for s in stops if s[0] == b["start_stop_id"])
        cur.execute("INSERT INTO buses (id, route_id, current_lat, current_lng) VALUES (?, ?, ?, ?);",
                    (route_id, route_id, start_stop[2], start_stop[3]))

        for tstr in hhmm_iter(6, 22, 30):
            cur.execute("INSERT INTO schedules (route_id, departure_time) VALUES (?, ?);", (route_id, tstr))

    conn.commit()
    conn.close()
    print("Cyclic DB with 20 buses created at", DB)

if __name__ == "__main__":
    create_db()
