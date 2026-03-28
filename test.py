import requests
import time

def send_data():
    # 1. Your Web App URL
    url = "https://script.google.com/macros/s/AKfycbxiKuvWjaRd8nsbw-DKKPEDRZZSoBhjUueOznVS0rW-TgZRUYxsuyERjxfFwgS2hXgNnA/exec"

    # 2. URL Parameters (Maps to e.parameter in Apps Script)
    url_params = {
        "action": "polling"
    }

    # 3. Request Body (Maps to e.postData.contents in Apps Script)
    payload = {
        "internId": "1",
        "lat": "26.70200043589285",
        "long": "92.83572897921471",
        "status": "bounded"
    }

    try:
        # Send POST with both params and json body
        # 'requests' automatically follows Google's redirects
        response = requests.post(url, params=url_params, json=payload)
        
        # Check for HTTP errors (e.g., 404, 500)
        response.raise_for_status()
        
        print(f"[{time.strftime('%H:%M:%S')}] Success: {response.text}")

    except requests.exceptions.RequestException as e:
        print(f"[{time.strftime('%H:%M:%S')}] Request failed: {e}")

def start_timer():
    print("Script started. Press Ctrl+C to stop.")
    while True:
        send_data()
        # Wait 30 seconds before the next hit
        time.sleep(30)

if __name__ == "__main__":
    start_timer()
