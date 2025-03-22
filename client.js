import { McpClient } from "@modelcontextprotocol/sdk/client/mcp.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// Create MCP client
const client = new McpClient({
  name: "weather-client",
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

    // Example: Get weather data for a city
    const response = await client.tools.getWeatherDataByCityName.invoke({
      city: "Mysore"
    });
    console.log("Weather data:", response);

  } catch (error) {
    console.error("Error:", error);
  }
}

init(); 