# mayan-relationship-mcp

MCP server that fetches Mayan zodiac signs from [mymayansign.com](https://mymayansign.com/mayan-sign-calculator/) and generates relationship compatibility analyses. Deployed on Cloudflare Workers.

## Tools

### `get_mayan_sign`

Fetches the Mayan zodiac profile for a single birthday.

- **Input:** `birthday` (string, e.g., "January 1, 1990", "1990-01-01", "19900101")
- **Output:** JSON with day sign, galactic tone, and trecana sign

Example output:

```json
{
  "day_sign": "Dog",
  "galactic_tone": "12",
  "trecana_sign": "Storm"
}
```

### `analyze_relationship`

Fetches both Mayan signs and returns a complete analysis prompt for the LLM.

- **Input:** `male_birthday` (e.g., "January 1, 1990"), `female_birthday` (e.g., "May 15, 1992")
- **Output:** Structured prompt with both Mayan profiles ready for relationship analysis

Example output:

```
Male's Mayan sign: Dog (Tone 12, Trecana: Storm)
Female's Mayan sign: Eagle (Tone 6, Trecana: Dog)
```

Try: *"Analyze the Mayan relationship compatibility between male born on January 1, 1990 and female born on May 15, 1992"*

## Prerequisites

- [Bun](https://bun.sh/) installed
- [Cloudflare account](https://dash.cloudflare.com/) for deployment (HTTP mode only)

## Local Usage (stdio)

Run the MCP server locally via stdio transport for use with Claude Desktop, Cursor, or other MCP clients:

```bash
bun run mcp
```

Or directly:

```bash
bun run dist/stdio.js
```

### opencode Configuration (Local)

Add to your `opencode.json` or `opencode.jsonc`:

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

This requires the package to be installed globally or available in your PATH. If installed locally, use the full path:

```json
{
  "mcpServers": {
    "mayan-relationship": {
      "type": "local",
      "command": ["bun", "run", "/absolute/path/to/mayan-relationship-mcp/dist/stdio.js"]
    }
  }
}
```

### Claude Desktop / Cursor Configuration

Add to your MCP config file (e.g., `~/Library/Application Support/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "mayan-relationship": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/mayan-relationship-mcp/dist/stdio.js"]
    }
  }
}
```

A sample `mcp.json` is included in the repo root.

## Cloudflare Workers Deployment (HTTP/SSE)

### Local development

```bash
bun install
bun run build
bun run dev
```

The MCP server will be available at `http://localhost:8788/mcp`.

### Deploy to Cloudflare Workers

```bash
bun install
bun run build
bunx wrangler deploy
```

The server will be deployed to your `workers.dev` subdomain at:

```
https://mayan-relationship-mcp.<your-subdomain>.workers.dev/mcp
```

### opencode Configuration (Remote)

Add to your `opencode.json` or `opencode.jsonc`:

```json
{
  "mcpServers": {
    "mayan-relationship": {
      "type": "remote",
      "url": "https://mayan-relationship-mcp.<your-subdomain>.workers.dev/mcp"
    }
  }
}
```

### Testing with MCP Inspector

Run the MCP inspector and connect to your local server:

```bash
npx @modelcontextprotocol/inspector@latest
```

Then enter `http://localhost:8788/mcp` as the server URL.

## Supported Date Formats

The server accepts dates in multiple formats:

- **Human-readable:** "January 1, 1990", "Jan 1, 1990", "1 January 1990"
- **ISO format:** "1990-01-01"
- **US format:** "01/01/1990"
- **Compact:** "19900101"

## Project Structure

```
mayan-relationship-mcp/
├── src/
│   ├── server.ts     # Shared MCP server factory (transport-agnostic)
│   ├── index.ts      # Cloudflare Workers entry point (HTTP/SSE)
│   ├── stdio.ts      # Local stdio entry point
│   ├── client.ts     # Date parsing + HTTP fetch
│   └── parser.ts     # HTML parsing
├── mcp.json          # Sample Claude Desktop config
├── package.json
├── tsconfig.json
├── wrangler.toml
└── README.md
```

## Python Version (Archive)

The original Python implementation has been moved to [mayan-relationship-python-mcp](../mayan-relationship-python-mcp/).
