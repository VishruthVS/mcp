# Weather Data Service

A simple weather data service using Server-Sent Events (SSE) and MCP protocol.

## Getting Started

### Option 1: Without Docker

#### 1. Start the Server

First, start the Node.js server:

```bash
node index.js
```

The server will start on port 3000. You should see:
```
Server running on port 3000
```

#### 2. Connect to SSE Stream

In a new terminal, establish the SSE connection:

```bash
curl -N --http1.1 http://localhost:3000/sse
```

Keep this connection running. You should see periodic ping messages every 30 seconds.

#### 3. Make NFT Contract Data Requests

In another terminal, you can make requests to get NFT contract data. Here's an example:

```bash
curl -X POST http://localhost:3000/messages \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
  "type": "invoke",
  "id": "1",
  "tool": "getNFTContractData",
  "params": {
    "contractAddress": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
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
        "text": "[{\"address\":\"0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D\",\"deployedTransactionHash\":\"0x22199329b0aa1aa68902a78e3b32ca327c872fab166c7a2838273de6ad383eba\",\"deployedAt\":\"2024-07-15T07:34:23.000Z\",\"deployerAddress\":\"0xaBA7161A7fb69c88e16ED9f455CE62B791EE4D03\",\"logoUrl\":null,\"type\":\"ERC721\",\"name\":\"BoredApeYachtClub\",\"symbol\":\"BAYC\"}]"
      }
    ]
  }
}
```

### Option 2: With Docker

#### 1. Build Docker Image

```bash
docker build -t mcp-server .
```

#### 2. Run Docker Container

```bash
docker run -p 3000:3000 mcp-server
```

#### 3. Connect to SSE Stream

In a new terminal, establish the SSE connection:

```bash
curl -N --http1.1 http://localhost:3000/sse
```

#### 4. Fetch NFT Contract Data

In another terminal, you can make requests to get NFT contract data. Here's an example:

```bash
curl -X POST http://localhost:3000/messages \
-H "Content-Type: application/json" \
-H "Accept: application/json" \
-d '{
  "type": "invoke",
  "id": "1",
  "tool": "getNFTContractData",
  "params": {
    "contractAddress": "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
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
        "text": "[{\"address\":\"0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D\",\"deployedTransactionHash\":\"0x22199329b0aa1aa68902a78e3b32ca327c872fab166c7a2838273de6ad383eba\",\"deployedAt\":\"2024-07-15T07:34:23.000Z\",\"deployerAddress\":\"0xaBA7161A7fb69c88e16ED9f455CE62B791EE4D03\",\"logoUrl\":null,\"type\":\"ERC721\",\"name\":\"BoredApeYachtClub\",\"symbol\":\"BAYC\"}]"
      }
    ]
  }
}
```

## Available Contract Addresses

Currently, the service supports one contract address:
- 0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D

For any other contract address, it will return:
```json
{
  "address": "null",
  "deployedTransactionHash": "null",
  "deployedAt": "null",
  "deployerAddress": "null",
  "logoUrl": "null",
  "type": "null",
  "name": "null",
  "symbol": "null"
}
```

## Important Notes

1. Always ensure the SSE connection is established before making requests to `/messages`
2. Keep the SSE connection running while making requests
3. Each request must include:
   - `type`: "invoke"
   - `id`: A unique identifier
   - `tool`: "getNFTContractData"
   - `params`: Object containing the contract address
