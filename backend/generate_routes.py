import sqlite3
import json
import requests
import time

DB = "db.sqlite"
OSRM_URL = "https://router.project-osrm.org/route/v1/driving/{},{};{},{}?overview=full&geometries=geojson"

def get_route_coords(from_stop, to_stop):
    """Fetch route between two stops from OSRM"""
    url = OSRM_URL.format(from_stop["lng"], from_stop["lat"], to_stop["lng"], to_stop["lat"])
    try:
        res = requests.get(url, timeout=15)
        data = res.json()
        if "routes" in data and data["routes"]:
            coords = data["routes"][0]["geometry"]["coordinates"]
            return [[lat, lng] for lng, lat in coords]  # flip lng/lat → lat/lng
    except Exception as e:
        print("OSRM error:", e)
    return []

def build_routes():
    conn = sqlite3.connect(DB)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()

    # ensure buses table has route_coords column
    cur.execute("PRAGMA table_info(buses)")
    cols = [c[1] for c in cur.fetchall()]
    if "route_coords" not in cols:
        cur.execute("ALTER TABLE buses ADD COLUMN route_coords TEXT")

    cur.execute("SELECT * FROM stops")
    stops = [dict(row) for row in cur.fetchall()]

    if not stops:
        print("❌ No stops found in DB.")
        return

    # get all buses
    cur.execute("SELECT * FROM buses")
    buses = [dict(row) for row in cur.fetchall()]

    if not buses:
        print("❌ No buses found in DB.")
        return

    for i, bus in enumerate(buses):
        source = next((s for s in stops if s["id"] == bus["id"]), stops[0])
        print(f"🚍 Building route for Bus #{bus['id']} (source: {source['name']})")

        coords = []
        current = source

        # visit all stops once
        for stop in stops:
            if stop["id"] == current["id"]:
                continue
            segment = get_route_coords(current, stop)
            coords.extend(segment)
            current = stop
            time.sleep(1)  # prevent OSRM rate-limit

        # loop back to source
        back_segment = get_route_coords(current, source)
        coords.extend(back_segment)

        # save route into DB
        cur.execute(
            "UPDATE buses SET route_coords = ? WHERE id = ?",
            (json.dumps(coords), bus["id"])
        )
        print(f"✅ Bus #{bus['id']} route stored with {len(coords)} points.")

    conn.commit()
    conn.close()
    print("🎉 All bus routes updated in DB")

if __name__ == "__main__":
    build_routes()
