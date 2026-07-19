import urllib.request, json
req = urllib.request.Request('http://localhost:8000/api/v1/research/query', data=json.dumps({"query": "zero-shot object detection"}).encode('utf-8'), headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as response:
        print(json.loads(response.read().decode('utf-8')))
except Exception as e:
    print(e)
