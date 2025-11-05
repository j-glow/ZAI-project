import requests
import time
import random
import threading

import os

# --- Configuration ---
BASE_URL = os.environ.get("API_BASE_URL", "http://localhost:5000/api")
LOGIN_URL = f"{BASE_URL}/users/login"
SERIES_URL = f"{BASE_URL}/series"
MEASUREMENTS_URL = f"{BASE_URL}/measurements"
POST_INTERVAL_SECONDS = 5

SENSORS = [
    {"username": "sensor1", "password": "sensor1", "series_name": "Temperature"},
    {"username": "sensor2", "password": "sensor2", "series_name": "Humidity"},
    {"username": "sensor3", "password": "sensor3", "series_name": "Pressure"}
]
# ---------------------

def login(username, password):
    """Logs in to the API and returns an auth token."""
    try:
        payload = {"username": username, "password": password}
        res = requests.post(LOGIN_URL, json=payload)
        res.raise_for_status()  # Raise an exception for bad status codes
        return res.json().get('token')
    except requests.exceptions.RequestException as e:
        print(f"[{username}] Login failed: {e}")
        return None

def get_series_details(token, series_name):
    """Fetches details for a specific series by name."""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        res = requests.get(SERIES_URL, headers=headers)
        res.raise_for_status()
        all_series = res.json()
        for series in all_series:
            if series.get('name') == series_name:
                return series
        print(f"Series '{series_name}' not found.")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Could not fetch series details for '{series_name}': {e}")
        return None

def post_measurement(token, series_id, value):
    """Posts a new measurement to the API."""
    try:
        headers = {"Authorization": f"Bearer {token}"}
        payload = {"seriesId": series_id, "value": value}
        res = requests.post(MEASUREMENTS_URL, json=payload, headers=headers)
        res.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f"Failed to post measurement: {e.response.text if e.response else e}")
        return False

def simulate_sensor(sensor_info):
    """The main loop for a single sensor simulation."""
    username = sensor_info["username"]
    password = sensor_info["password"]
    series_name = sensor_info["series_name"]

    print(f"[{username}] Starting simulation for series '{series_name}'...")

    # 1. Login and get token
    token = login(username, password)
    if not token:
        print(f"[{username}] Halting simulation due to login failure.")
        return

    # 2. Get series details (ID, min, max)
    series_details = get_series_details(token, series_name)
    if not series_details:
        print(f"[{username}] Halting simulation, cannot find series '{series_name}'.")
        return

    series_id = series_details.get('id')
    s_min = series_details.get('min_value', 0)
    s_max = series_details.get('max_value', 100)

    # 3. Start posting measurements
    while True:
        value_to_post = random.uniform(s_min, s_max)
        print(f"[{username}] Posting value to '{series_name}': {value_to_post:.2f}")

        if not post_measurement(token, series_id, value_to_post):
            # If posting fails, try to log in again to refresh the token
            print(f"[{username}] Measurement post failed. Attempting to re-login...")
            token = login(username, password)
            if not token:
                print(f"[{username}] Re-login failed. Halting.")
                break

        time.sleep(POST_INTERVAL_SECONDS * len(SENSORS)) # Stagger posts

def main():
    print("--- Starting Multi-Sensor Simulation ---")
    print("Press CTRL+C to stop.")

    threads = []
    try:
        for i, sensor in enumerate(SENSORS):
            thread = threading.Thread(target=simulate_sensor, args=(sensor,))
            threads.append(thread)
            thread.start()
            time.sleep(POST_INTERVAL_SECONDS) # Stagger the start of each sensor

        for thread in threads:
            thread.join() # Wait for all threads to complete

    except KeyboardInterrupt:
        print("\n--- Sensor simulation stopped by user. ---")

if __name__ == "__main__":
    main()
