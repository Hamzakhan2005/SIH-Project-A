import sqlite3
from time import sleep
from geopy.geocoders import Nominatim

DB = "db.sqlite"
geolocator = Nominatim(user_agent="transit-mvp-demo")

def geocode_and_update():
    conn = sqlite3.connect(DB)
    cur = conn.cursor()
    cur.execute("SELECT id, name FROM stops")
    rows = cur.fetchall()
    for id_, name in rows:
        try:
            loc = geolocator.geocode(f"{name}, Lucknow, India", timeout=10)
            if loc:
                print("Found:", name, loc.latitude, loc.longitude)
                cur.execute("UPDATE stops SET lat=?, lng=? WHERE id=?", (loc.latitude, loc.longitude, id_))
                conn.commit()
            else:
                print("No geocode found for:", name)
        except Exception as e:
            print("Error geocoding", name, e)
        sleep(1)  # be polite to Nominatim (rate-limit)
    conn.close()

if __name__ == "__main__":
    geocode_and_update()
