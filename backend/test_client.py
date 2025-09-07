import requests

url = 'http://localhost:8000/generate'
resp = requests.post(url, json={"grid_size": "1-19-1"})
print(resp.json())
