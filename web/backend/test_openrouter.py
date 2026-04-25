import os
import requests
from dotenv import load_dotenv
from pathlib import Path

# Try to find .env in root
dotenv_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=dotenv_path)

api_key = os.getenv("OPENROUTER_API_KEY")
print(f"API Key: {api_key[:10]}...{api_key[-5:]}" if api_key else "No Key Found")

if api_key:
    # Test request to OpenRouter
    url = "https://openrouter.ai/api/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "openai/gpt-4o-mini",
        "messages": [{"role": "user", "content": "Ping"}]
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")
else:
    print("Skipping test because no key found.")
