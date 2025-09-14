# route_builder.py
import sqlite3, requests, json, time

DB = "db.sqlite"
OSRM = "https://router.project-osrm.org/route/v1/driving/{}?overview=full&geometries=geojson"

def db_conn():
    return sqlite3.connect(DB)

def build_all_routes():
    conn = db_conn()
    cur = conn.cursor()

    # get all routes
    cur.execute("SELECT id FROM routes")
    routes = [r[0] for r in cur.fetchall()]

    for rid in routes:
        # get ordered stop ids for this route
        cur.execute("SELECT stop_id FROM route_stops WHERE route_id=? ORDER BY stop_order", (rid,))
        stop_ids = [r[0] for r in cur.fetchall()]
        if len(stop_ids) < 2:
            print(f"route {rid} has <2 stops, skipping")
            continue

        # get lat/lng for stops in order
        placeholders = ",".join("?"*len(stop_ids))
        cur.execute(f"SELECT id, lat, lng FROM stops WHERE id IN ({placeholders})", tuple(stop_ids))
        rows = {r[0]: (r[1], r[2]) for r in cur.fetchall()}
        ordered_coords = []
        for sid in stop_ids:
            lat,lng = rows[sid]
            ordered_coords.append((lat,lng))

        # build OSRM waypoints string: lon,lat;lon,lat;...
        waypoints = ";".join([f"{lng},{lat}" for (lat,lng) in ordered_coords])

        coords = []
        try:
            url = OSRM.format(waypoints)
            print("OSRM request:", url[:200])
            res = requests.get(url, timeout=20).json()
            if res.get("routes"):
                raw = res["routes"][0]["geometry"]["coordinates"]
                # convert to [[lat, lng], ...]
                coords = [[lat, lng] for (lng, lat) in raw]
        except Exception as e:
            print("OSRM fail:", e)

        # fallback: use stops themselves if OSRM failed
        if not coords:
            coords = [[lat, lng] for (lat,lng) in ordered_coords]

        # store coords JSON into buses for this route
        cur.execute("UPDATE buses SET route_coords=? WHERE route_id=?", (json.dumps(coords), rid))
        conn.commit()
        print(f"Route {rid} stored with {len(coords)} points")
        time.sleep(1)  # polite pause

    conn.close()

if __name__ == "__main__":
    build_all_routes()
