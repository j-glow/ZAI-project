import requests
import time
import random
import getpass

# --- Configuration ---
BASE_URL = "http://localhost:5000/api"
LOGIN_URL = f"{BASE_URL}/users/login"
SERIES_URL = f"{BASE_URL}/series"
MEASUREMENTS_URL = f"{BASE_URL}/measurements"
# ---------------------

def login(username, password):
    """Logs in to the API and returns an auth token."""
    print("Logging in...")
    try:
        payload = {"username": username, "password": password}
        res = requests.post(LOGIN_URL, json=payload)

        if res.status_code == 200:
            print("Login successful.")
            return res.json()['token']
        else:
            print(f"Login failed: {res.status_code} - {res.text}")
            return None
    except requests.exceptions.ConnectionError:
        print("Error: Could not connect to backend. Is it running?")
        return None

def get_series(token):
    """Fetches the list of available series."""
    print("Fetching series list...")
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(SERIES_URL, headers=headers)
    return res.json()

def post_measurement(token, series_id, value):
    """Posts a new measurement to the API."""
    headers = {"Authorization": f"Bearer {token}"}
    payload = {
        "series": series_id,
        "value": value,
        "timestamp": None  # We'll let the server set the current time
    }

    try:
        res = requests.post(MEASUREMENTS_URL, json=payload, headers=headers)
        if res.status_code == 201: # 201 = Created
            print(f"  -> Successfully posted: {value:.2f}")
        else:
            # This will show validation errors (e.g., if value is out of range)
            print(f"  -> Failed to post: {res.status_code} - {res.text}")
    except Exception as e:
        print(f"Error posting measurement: {e}")

def main():
    username = input("Enter admin username: ")
    password = getpass.getpass("Enter admin password: ")

    token = login(username, password)
    if not token:
        return

    series_list = get_series(token)
    if not series_list:
        print("No series found. Please create a series in the app first.")
        return

    print("\nAvailable Series:")
    for i, series in enumerate(series_list):
        print(f"  [{i+1}] {series['name']} (Min: {series['min_value']}, Max: {series['max_value']})")

    try:
        choice = int(input(f"Which series do you want to simulate? (1-{len(series_list)}): ")) - 1
        selected_series = series_list[choice]
    except (ValueError, IndexError):
        print("Invalid choice. Exiting.")
        return

    s_id = selected_series['_id']
    s_min = selected_series['min_value']
    s_max = selected_series['max_value']

    print(f"\n--- Starting sensor simulation for '{selected_series['name']}' ---")
    print(f"Generating random values between {s_min} and {s_max}.")
    print("Press CTRL+C to stop.")

    try:
        while True:
            # Generate a random float value within the series' valid range
            value_to_post = random.uniform(s_min, s_max)
            post_measurement(token, s_id, value_to_post)

            # Wait for 3 seconds before sending the next one
            time.sleep(3)
    except KeyboardInterrupt:
        print("\nSensor simulation stopped.")

if __name__ == "__main__":
    main()
