# Development Guide

This document covers everything you need to know to build, run, test, and deploy the Mayan Relationship MCP server.

## Prerequisites

- [Bun](https://bun.sh/) v1.0+
- [Cloudflare account](https://dash.cloudflare.com/) (for deployment only)

## Installation

```bash
git clone https://github.com/mariodian/mayan-relationship-mcp.git
cd mayan-relationship-mcp
bun install
bun run build
```

## Local Usage

### stdio transport

```bash
bun run mcp
```

Or directly:

```bash
bun run dist/stdio.js
```

### Local stdio config

```json
{
  "mcpServers": {
    "mayan-relationship": {
      "type": "local",
      "command": ["mayan-relationship-mcp"]
    }
  }
}
```

If installed locally, use the full path:

```json
{
  "mcpServers": {
    "mayan-relationship": {
      "type": "local",
      "command": [
        "bun",
        "run",
        "/absolute/path/to/mayan-relationship-mcp/dist/stdio.js"
      ]
    }
  }
}
```

## Deployment

### Cloudflare Workers (HTTP/SSE)

```bash
bun install
bun run build
bunx wrangler deploy
```

The server will be deployed to:

```
https://mayan-relationship-mcp.<your-subdomain>.workers.dev/mcp
```

## Testing

### Run tests

```bash
bun test
```

### Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector@latest
```

Then enter `http://localhost:8788/mcp` as the server URL.

## Project Structure

```
mayan-relationship-mcp/
├── src/
│   ├── server.ts     # Shared MCP server factory (transport-agnostic)
│   ├── index.ts      # Cloudflare Workers entry point (HTTP/SSE)
│   ├── stdio.ts      # Local stdio entry point
│   ├── client.ts     # Date parsing / validation
│   ├── tzolkin.ts    # Tzolk'in calculation (GMT correlation)
├── mcp.json          # Sample Claude Desktop config
├── package.json
├── tsconfig.json
├── wrangler.toml
└── README.md
```

## Security

- **Tool-call approval**: most MCP clients ask you to manually accept each tool call before they run. Keep this setting enabled and review tool-call details before executing.
- **No sensitive data**: this server computes public Mayan zodiac data locally. No secrets, tokens, or personal data are stored or transmitted.
- **Self-hosting**: if you deploy your own instance, you control the transport and can restrict access as needed.
