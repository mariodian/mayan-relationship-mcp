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

## Development

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Cloudflare account](https://dash.cloudflare.com/) for deployment

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

## Configuration

### opencode

Add to your `opencode.json` or `opencode.jsonc`:

```json
{
  "mcpServers": {
    "mayan-relationship": {
      "url": "https://mayan-relationship-mcp.<your-subdomain>.workers.dev/mcp"
    }
  }
}
```

### Claude Desktop / Cursor / Perplexity

Add to your MCP config file:

```json
{
  "mcpServers": {
    "mayan-relationship": {
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
│   ├── index.ts      # Worker entry point + MCP server
│   ├── client.ts     # Date parsing + HTTP fetch
│   └── parser.ts     # HTML parsing
├── package.json
├── tsconfig.json
├── wrangler.toml
└── README.md
```

## Python Version (Archive)

The original Python implementation has been moved to [mayan-relationship-python-mcp](../mayan-relationship-python-mcp/).
