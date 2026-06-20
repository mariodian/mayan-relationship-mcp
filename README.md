<div align="center">
<img width="128" height="128" alt="Mayan Relationship MCP Logo" src="media/logo.webp" />
<h1>Mayan Relationship MCP</h1>

MCP server that fetches Mayan zodiac signs and generates relationship compatibility analyses. Deployed on Cloudflare Workers.

[Report Bug](https://github.com/mariodian/mayan-relationship-mcp/issues/new?template=bug-report.md) · [Request Feature](https://github.com/mariodian/mayan-relationship-mcp/issues/new?template=feature-request.md)

</div>

## ⚡ Quick Start

Add the remote MCP server to your AI assistant:

```json
{
  "mcpServers": {
    "mayan-relationship": {
      "url": "https://mayan-relationship-mcp.geckos-chillies-0y.workers.dev/mcp"
    }
  }
}
```

<details>
<summary><strong>OpenCode</strong></summary>

Add to your `opencode.json` or `opencode.jsonc`:

```json
{
  "mcpServers": {
    "mayan-relationship": {
      "type": "remote",
      "url": "https://mayan-relationship-mcp.geckos-chillies-0y.workers.dev/mcp"
    }
  }
}
```

</details>

<details>
<summary><strong>Claude</strong></summary>

Add to your MCP config file (`~/.claude/config.json` on Mac/Linux):

```json
{
  "mcpServers": {
    "mayan-relationship": {
      "type": "http",
      "url": "https://mayan-relationship-mcp.geckos-chillies-0y.workers.dev/mcp"
    }
  }
}
```

</details>

<details>
<summary><strong>Codex</strong></summary>

Add to your `~/.codex/config.toml`:

```toml
[mcp_servers.mayan-relationship]
url = "https://mayan-relationship-mcp.geckos-chillies-0y.workers.dev/mcp"
```

</details>

<details>
<summary><strong>Cursor</strong></summary>

Add to your `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "mayan-relationship": {
      "url": "https://mayan-relationship-mcp.geckos-chillies-0y.workers.dev/mcp"
    }
  }
}
```

</details>

Reload your assistant and try: _"Analyze the Mayan relationship compatibility between male born on January 1, 1990 and female born on May 15, 1992"_

## 📋 Table of Contents

- ⚡ [Quick Start](#-quick-start)
- 🤔 [Why Mayan Relationship MCP?](#-why-mayan-relationship-mcp)
- ✨ [Features](#-features)
- 📥 [Installation](#-installation)
- 🚀 [Usage](#-usage)
- 🔧 [Tools](#-tools)
- 📁 [Project Structure](#-project-structure)
- ⚠️ [Security](#%EF%B8%8F-security)
- 💬 [Contributing](#-contributing)
- 📜 [License](#-license)
- 📌 [Credits](#-credits)

## 🤔 Why Mayan Relationship MCP?

The Mayan zodiac offers a unique system of day signs, galactic tones, and trecana signs. This MCP server brings that knowledge directly into your AI assistant, enabling instant zodiac lookups and relationship compatibility readings without leaving your workflow.

## ✨ Features

- **Zodiac lookup**: fetch Mayan day sign, galactic tone, and trecana sign from any birthday
- **Relationship analysis**: generate structured compatibility prompts for two people
- **Flexible date parsing**: accepts "January 1, 1990", "1990-01-01", "01/01/1990", "19900101"
- **Dual transport**: local stdio for desktop clients, remote HTTP/SSE via Cloudflare Workers
- **Zero API keys**: no authentication required for the hosted remote server

## 📥 Installation

### Prerequisites

- [Bun](https://bun.sh/) v1.0+
- [Cloudflare account](https://dash.cloudflare.com/) (for deployment only)

### From source

```bash
git clone https://github.com/mariodian/mayan-relationship-mcp.git
cd mayan-relationship-mcp
bun install
bun run build
```

## 🚀 Usage

### Local (stdio)

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

### Testing with MCP Inspector

```bash
npx @modelcontextprotocol/inspector@latest
```

Then enter `http://localhost:8788/mcp` as the server URL.

## 🔧 Tools

### `get_mayan_sign`

Fetches the Mayan zodiac profile for a single birthday.

- **Input:** `birthday` (string, e.g., `"January 1, 1990"`, `"1990-01-01"`, `"19900101"`)
- **Output:** JSON with day sign, galactic tone, and trecana sign

```json
{
  "day_sign": "Dog",
  "galactic_tone": "12",
  "trecana_sign": "Storm"
}
```

### `analyze_relationship`

Fetches both Mayan signs and returns a complete analysis prompt for the LLM.

- **Input:** `male_birthday` (e.g., `"January 1, 1990"`), `female_birthday` (e.g., `"May 15, 1992"`)
- **Output:** Structured prompt with both Mayan profiles ready for relationship analysis

```
Male's Mayan sign: Dog (Tone 12, Trecana: Storm)
Female's Mayan sign: Eagle (Tone 6, Trecana: Dog)
```

## 📁 Project Structure

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

## ⚠️ Security

- **Tool-call approval**: most MCP clients ask you to manually accept each tool call before they run. Keep this setting enabled and review tool-call details before executing.
- **No sensitive data**: this server reads public zodiac data from mymayansign.com. No secrets, tokens, or personal data are stored or transmitted.
- **Self-hosting**: if you deploy your own instance, you control the transport and can restrict access as needed.

## 💬 Contributing

Contributions are welcome. Please open an issue or pull request on [GitHub](https://github.com/mariodian/mayan-relationship-mcp).

## 📜 License

MIT. See [LICENSE](LICENSE).

## 📌 Credits

[Mayan Relationship MCP on GitHub](https://github.com/mariodian/mayan-relationship-mcp) · [Mario Dian on X](https://x.com/mariodian)

_Zodiac data sourced from [mymayansign.com](https://mymayansign.com/mayan-sign-calculator/)._
