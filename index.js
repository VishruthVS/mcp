import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
  name: "Weather Data fetch",
  version: "1.0.0"
});

async function getWeatherCity(city=''){
    if(city.toLowerCase()==='mysore'){
        return {temp:'30c',forecast:'chances of high rain'};
    }
    if(city.toLowerCase()==='bangalore'){
      return {temp:'10c',forecast:'chances of high rain and wind'};
  } 
  return {temp:'null',forecast:'unable to fetch '};

}
// Add an addition tool
server.tool("getWeatherDataByCityName",
 { city : z.string(),}, 
  async ({ city}) => {
    return {content: [{ type: "text", text: JSON.stringify(await getWeatherCity(city)) }]}
  }
);

// Add a dynamic greeting resource
// server.resource(
//   "greeting",
//   new ResourceTemplate("greeting://{name}", { list: undefined }),
//   async (uri, { name }) => ({
//     contents: [{
//       uri: uri.href,
//       text: `Hello, ${name}!`
//     }]
//   })
// );

// Start receiving messages on stdin and sending messages on stdout
async function init(){
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

// Start the server
init().catch(console.error);
