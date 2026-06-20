import { createMcpHandler } from "agents/mcp";
import { createServer } from "./server";

interface Env {}

export default {
  fetch: (request: Request, env: Env, ctx: ExecutionContext) => {
    const server = createServer();
    return createMcpHandler(server as any, {
      route: "/mcp",
      corsOptions: {
        origin: "*",
        methods: "GET, POST, OPTIONS",
      },
    })(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;
