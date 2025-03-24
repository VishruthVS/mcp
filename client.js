import { McpClient } from "@modelcontextprotocol/sdk/client/mcp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// Create MCP client
const client = new McpClient({
  name: "nft-client",
  version: "1.0.0"
});

async function init() {
  try {
    // Create SSE transport
    const transport = new SSEClientTransport(
      new URL("http://localhost:3000/sse")
    );

    // Connect to the server
    await client.connect(transport);
    console.log("Connected to server successfully!");

    // Get NFT contract data
    const response = await client.tools.getNFTContractData.invoke({
      contractAddress: "0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D"
    });
    console.log("NFT Contract data:", JSON.parse(response.content[0].text));

  } catch (error) {
    console.error("Error:", error);
  }
}

init();