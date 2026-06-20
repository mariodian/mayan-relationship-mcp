import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fetchMayanSign } from "./client";

export function createServer(): McpServer {
  const server = new McpServer({
    name: "mayan-relationship",
    version: "0.1.0",
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
      inputSchema: { male_birthday: z.string(), female_birthday: z.string() },
    },
    async ({ male_birthday, female_birthday }) => {
      try {
        const maleSign = await fetchMayanSign(male_birthday);
        const femaleSign = await fetchMayanSign(female_birthday);

        const prompt = `Calculate mayan calendar horoscope

male's birthday is ${male_birthday}
female's birthday is ${female_birthday}

Male's Mayan sign: ${maleSign.day_sign} (Tone ${maleSign.tone}, Trecana: ${maleSign.trecana_sign})
Female's Mayan sign: ${femaleSign.day_sign} (Tone ${femaleSign.tone}, Trecana: ${femaleSign.trecana_sign})

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

  return server;
}
