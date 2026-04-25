import os
import sys
import json
import urllib.request
import urllib.error
from datetime import datetime, timezone

SNAPSHOT_FILE = ".api_usage_snapshot.json"

def get_api_key():
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        try:
            with open(".env", "r") as f:
                for line in f:
                    if line.startswith("OPENROUTER_API_KEY="):
                        api_key = line.strip().split("=")[1].strip().strip('"').strip("'")
                        break
        except FileNotFoundError:
            pass
            
    if not api_key:
        print("Error: OPENROUTER_API_KEY not found in environment or .env file.")
        sys.exit(1)
    return api_key

def fetch_openrouter_data(endpoint, api_key):
    url = f"https://openrouter.ai/api/v1/{endpoint}"
    req = urllib.request.Request(url, headers={"Authorization": f"Bearer {api_key}"})
    try:
        with urllib.request.urlopen(req) as response:
            if response.status == 200:
                data = json.loads(response.read().decode('utf-8'))
                return data.get('data', data)
            else:
                return None
    except urllib.error.URLError:
        return None

def analyze_usage():
    print("Fetching OpenRouter API usage data...\n")
    api_key = get_api_key()
    
    credits_data = fetch_openrouter_data("credits", api_key)
    key_data = fetch_openrouter_data("key", api_key)
    
    if not credits_data or not key_data:
        print("Error: Could not retrieve core API data from OpenRouter.")
        sys.exit(1)
        
    total_credits = credits_data.get('total_credits', 0.0)
    lifetime_usage = credits_data.get('total_usage', 0.0)
    
    key_limit = key_data.get('limit')
    key_usage = key_data.get('usage', 0.0)
    
    print("=== Current Status ===")
    print(f"Total Credits Available : ${total_credits:.4f}")
    print(f"Total Lifetime Usage    : ${lifetime_usage:.4f}")
    print(f"Current Key Usage       : ${key_usage:.4f}")
    if key_limit is not None:
        print(f"Current Key Limit       : ${key_limit:.4f}")
    print("======================\n")

    # Local Snapshot Forecasting
    now = datetime.now(timezone.utc)
    current_snapshot = {
        "timestamp": now.isoformat(),
        "key_usage": key_usage,
        "total_credits": total_credits
    }
    
    daily_burn_rate = 0.0
    
    if os.path.exists(SNAPSHOT_FILE):
        try:
            with open(SNAPSHOT_FILE, "r") as f:
                last_snapshot = json.load(f)
                
            last_time = datetime.fromisoformat(last_snapshot["timestamp"])
            last_usage = last_snapshot.get("key_usage", 0.0)
            
            hours_elapsed = (now - last_time).total_seconds() / 3600.0
            usage_diff = key_usage - last_usage
            
            if hours_elapsed > 0 and usage_diff > 0:
                daily_burn_rate = (usage_diff / hours_elapsed) * 24.0
                
            print("=== Usage Forecast (Based on local snapshot) ===")
            print(f"Since last check ({hours_elapsed:.1f} hours ago):")
            print(f"Usage incurred : ${usage_diff:.4f}")
            print(f"Daily burn rate: ${daily_burn_rate:.4f} / day")
            
            if daily_burn_rate > 0:
                days_remaining = total_credits / daily_burn_rate
                exhaustion_date = now + timedelta(days=days_remaining)
                print(f"Estimated days remaining: {days_remaining:.1f} days")
                print(f"Estimated exhaustion date: {exhaustion_date.strftime('%Y-%m-%d')}")
            else:
                print("Not enough usage detected to generate a forecast.")
            print("================================================\n")
        except Exception as e:
            print(f"Warning: Could not read snapshot file for forecasting. {e}")
    else:
        print("No previous usage snapshot found. A baseline has been saved.")
        print("Run this tool again after some usage to see a daily forecast.\n")
        
    # Save new snapshot
    with open(SNAPSHOT_FILE, "w") as f:
        json.dump(current_snapshot, f)

if __name__ == "__main__":
    analyze_usage()
