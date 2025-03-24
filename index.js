import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";
import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Create an MCP server
const server = new McpServer({
  name: "NFT Contract Data Fetch",
  version: "1.0.0"
});

async function getNFTContractData(contractAddress) {
    try {
        const response = await axios.post(
            'https://web3.nodit.io/v1/ethereum/mainnet/nft/getNftContractMetadataByContracts',
            {
                contractAddresses: [contractAddress]
            },
            {
                headers: {
                    'X-API-KEY': process.env.API_KEY,
                    'accept': 'application/json',
                    'content-type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching NFT data:', error);
        return { error: 'Unable to fetch NFT data' };
    }
}

// Add NFT data tool
server.tool("getNFTContractData",
 { contractAddress: z.string() }, 
  async ({ contractAddress }) => {
    const nftData = await getNFTContractData(contractAddress);
    return { content: [{ type: "text", text: JSON.stringify(nftData) }] };
  }
);

let connections = new Set();

// Add API endpoint for direct testing
app.post('/api', async (req, res) => {
  const { type, id, tool, params = {} } = req.body;
  
  if (tool === "getNFTContractData") {
    const nftData = await getNFTContractData(params.contractAddress);
    return res.json({
      type: "response",
      id,
      result: { content: [{ type: "text", text: JSON.stringify(nftData) }] }
    });
  }
  
  res.status(400).json({ error: "Invalid tool" });
});

// SSE endpoint
app.get("/sse", (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const transport = new SSEServerTransport("/messages", res);
  
  try {
    server.connect(transport);
    connections.add(transport);

    // Keep connection alive
    const keepAlive = setInterval(() => {
      if (res.writableEnded) {
        clearInterval(keepAlive);
        return;
      }
      res.write('data: ping\n\n');
    }, 30000);

    // Handle client disconnect
    req.on('close', () => {
      clearInterval(keepAlive);
      connections.delete(transport);
      transport.close();
    });

  } catch (error) {
    console.error('Error connecting transport:', error);
    res.end();
  }
});

// Message handling endpoint
app.post("/messages", express.json(), async (req, res) => {
  try {
    if (connections.size === 0) {
      return res.status(503).json({ error: "No SSE connection established. Please connect to /sse endpoint first." });
    }

    const transport = Array.from(connections).pop();
    
    if (!transport) {
      return res.status(503).json({ error: "No active transport" });
    }

    // Validate the message format
    const { type, id, tool, params } = req.body;
    if (!type || !id || !tool || !params) {
      return res.status(400).json({ error: "Invalid message format" });
    }

    // Process the request directly
    if (tool === "getNFTContractData") {
      const nftData = await getNFTContractData(params.contractAddress);
      return res.json({
        type: "response",
        id,
        result: { content: [{ type: "text", text: JSON.stringify(nftData) }] }
      });
    }

    return res.status(400).json({ error: "Unknown tool" });
  } catch (error) {
    console.error('Error handling message:', error);
    res.status(500).json({ 
      error: "Internal server error",
      details: error.message 
    });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
