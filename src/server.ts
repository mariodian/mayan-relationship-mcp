import { createRequire } from "module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchMayanSign } from "./client";

const require = createRequire(import.meta.url);
const pkg = require("../package.json") as { name: string; version: string };

const MAX_GROUP_SIZE = 10;

function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: pkg.name,
    version: pkg.version,
  });

  server.registerTool(
    "get_mayan_sign",
    {
      description: "Get the Mayan zodiac sign for a given birthday.",
      inputSchema: { birthday: z.string() },
    },
    async ({ birthday }) => {
      try {
        const sign = await fetchMayanSign(birthday);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(
                {
                  day_sign: sign.day_sign,
                  galactic_tone: sign.tone,
                  trecana_sign: sign.trecana_sign,
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (e) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: String(e) }, null, 2),
            },
          ],
        };
      }
    }
  );

  server.registerTool(
    "analyze_relationship",
    {
      description: "Analyze the Mayan zodiac relationship compatibility between two people. Fetches both Mayan signs and returns a complete analysis prompt that the LLM uses to generate the relationship reading.",
      inputSchema: { birthday1: z.string(), gender1: z.enum(["male", "female"]), birthday2: z.string(), gender2: z.enum(["male", "female"]) },
    },
    async ({ birthday1, gender1, birthday2, gender2 }) => {
      try {
        const sign1 = await fetchMayanSign(birthday1);
        const sign2 = await fetchMayanSign(birthday2);

        const prompt = `Calculate mayan calendar horoscope

${formatGender(gender1)}'s birthday is ${birthday1}
${formatGender(gender2)}'s birthday is ${birthday2}

${formatGender(gender1)}'s Mayan sign: ${sign1.day_sign} (Tone ${sign1.tone}, Trecana: ${sign1.trecana_sign})
${formatGender(gender2)}'s Mayan sign: ${sign2.day_sign} (Tone ${sign2.tone}, Trecana: ${sign2.trecana_sign})

Do a complete analysis of this relationship from all possible angles.`;

        return {
          content: [{ type: "text" as const, text: prompt }],
        };
      } catch (e) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: String(e) }, null, 2),
            },
          ],
        };
      }
    }
  );

  server.registerTool(
    "analyze_group",
    {
      description: "Analyze the Mayan zodiac relationship compatibility within a group of 3 to 10 people. Fetches all Mayan signs and returns a complete analysis prompt for group dynamics.",
      inputSchema: {
        people: z.array(
          z.object({
            birthday: z.string(),
            gender: z.enum(["male", "female"]),
          })
        ).min(3).max(MAX_GROUP_SIZE),
      },
    },
    async ({ people }) => {
      try {
        const signs = await Promise.all(
          people.map((p) => fetchMayanSign(p.birthday))
        );

        const membersList = people
          .map((p, i) => {
            const sign = signs[i];
            return `${i + 1}. ${formatGender(p.gender)} born on ${p.birthday} — Mayan sign: ${sign.day_sign} (Tone ${sign.tone}, Trecana: ${sign.trecana_sign})`;
          })
          .join("\n");

        const prompt = `Calculate mayan calendar horoscope

Group members:
${membersList}

Analyze the group dynamic and relationship compatibility among all members. Consider pair dynamics, overall group harmony, strengths, challenges, and notable patterns.`;

        return {
          content: [{ type: "text" as const, text: prompt }],
        };
      } catch (e) {
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify({ error: String(e) }, null, 2),
            },
          ],
        };
      }
    }
  );

  return server;
}
