# Weather Data Service

A simple weather data service using Server-Sent Events (SSE) and MCP protocol.

## Getting Started

### 1. Start the Server

First, start the Node.js server:

```bash
node index.js
```

The server will start on port 3000. You should see:
```
Server running on port 3000
```

### 2. Connect to SSE Stream

In a new terminal, establish the SSE connection:

```bash
curl -N --http1.1 http://localhost:3000/sse
```

Keep this connection running. You should see periodic ping messages every 30 seconds.

### 3. Make Weather Data Requests

In another terminal, you can make requests to get weather data. Here's an example:

```bash
curl -X POST http://localhost:3000/messages \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
  "type": "invoke",
  "id": "1",
  "tool": "getWeatherDataByCityName",
  "params": {
    "city": "Mysore"
  }
}'
```

You should receive a response like:
```json
{
  "type": "response",
  "id": "1",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"temp\":\"30c\",\"forecast\":\"chances of high rain\"}"
      }
    ]
  }
}
```

## Available Cities

Currently, the service supports two cities:
- Mysore
- Bangalore

For any other city, it will return:
```json
{
  "temp": "null",
  "forecast": "unable to fetch"
}
```

## Important Notes

1. Always ensure the SSE connection is established before making requests to `/messages`
2. Keep the SSE connection running while making requests
3. Each request must include:
   - `type`: "invoke"
   - `id`: A unique identifier
   - `tool`: "getWeatherDataByCityName"
   - `params`: Object containing the city name
