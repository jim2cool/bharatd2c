import requests
import json
import sys

# CONFIGURATION
DOMAIN = "easy-d2c.com"
IP_ADDRESS = "46.225.117.86"
API_KEY = "9jX7AkLF74m_Elv7ikuQpvCyRHvjVy6Uhc".strip()
API_SECRET = "Sw8GwjBH2uupYkNt3VxteQ".strip()

# GoDaddy API URL (Production)
URL = f"https://api.godaddy.com/v1/domains/{DOMAIN}/records/A/%40"

headers = {
    "Authorization": f"sso-key {API_KEY}:{API_SECRET}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}

data = [
    {
        "data": IP_ADDRESS,
        "ttl": 600
    }
]

print(f"Updating DNS for {DOMAIN}...")
print(f"Pointing '@' to {IP_ADDRESS}")

try:
    response = requests.put(URL, headers=headers, json=data)
    
    if response.status_code == 200:
        print("SUCCESS: DNS Updated Successfully!")
    else:
        print(f"FAILED: Status {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"ERROR: {str(e)}")
