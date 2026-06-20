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
      inputSchema: { birthday1: z.string(), gender1: z.string(), birthday2: z.string(), gender2: z.string() },
    },
    async ({ birthday1, gender1, birthday2, gender2 }) => {
      try {
        const sign1 = await fetchMayanSign(birthday1);
        const sign2 = await fetchMayanSign(birthday2);

        const prompt = `Calculate mayan calendar horoscope

${gender1}'s birthday is ${birthday1}
${gender2}'s birthday is ${birthday2}

${gender1}'s Mayan sign: ${sign1.day_sign} (Tone ${sign1.tone}, Trecana: ${sign1.trecana_sign})
${gender2}'s Mayan sign: ${sign2.day_sign} (Tone ${sign2.tone}, Trecana: ${sign2.trecana_sign})

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
