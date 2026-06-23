import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { calculateMayanSignFromBirthday } from "./tzolkin";

const PKG = { name: "mayan-relationship-mcp", version: "0.1.0" } as const;

const MAX_GROUP_SIZE = 10;

const analysisTypes = [
  "romantic",
  "friendship",
  "colleagues",
  "family",
  "business",
  "classmates",
  "general",
] as const;

export function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase();
}

export function getTypeLens(type: string): string {
  const lenses: Record<string, string> = {
    romantic: "This is a **romantic compatibility reading**. Focus on intimacy, emotional connection, partnership dynamics, long-term relationship potential, and how these energies support or challenge each other in a committed relationship.",
    friendship: "This is a **friendship compatibility reading**. Focus on loyalty, shared enjoyment, trust, communication style, mutual support, and how these energies complement each other as friends.",
    colleagues: "This is a **workplace colleagues compatibility reading**. Focus on collaboration style, communication in professional settings, complementary strengths, potential workplace conflicts, and how these energies work together as team members.",
    family: "This is a **family relationship compatibility reading**. Focus on familial bonds, inherited patterns, emotional support systems, generational dynamics, and how these energies nurture or challenge each other within a family context.",
    business: "This is a **business partnership compatibility reading**. Focus on complementary skills, decision-making styles, risk tolerance, productivity synergy, leadership dynamics, and how these energies support or conflict in a business venture.",
    classmates: "This is a **classmates/learning compatibility reading**. Focus on learning styles, study synergy, peer support, intellectual compatibility, motivation patterns, and how these energies help or hinder each other in educational settings.",
    general: "This is a **general compatibility reading**. Provide a balanced overview covering all aspects of the relationship without focusing on any specific context.",
  };
  return lenses[type] || lenses.general;
}

export function buildRelationshipPrompt(
  type: string,
  members: Array<{ label: string; birthday: string; sign: any }>,
  isGroup: boolean = false
): string {
  const typeLens = getTypeLens(type);
  
  let prompt = `# Mayan Zodiac ${isGroup ? "Group" : "Relationship"} Compatibility Analysis

**Analysis Type:** ${type.charAt(0).toUpperCase() + type.slice(1)}

${typeLens}

## Participants

${members.map((m) => {
  return `**${m.label}** (born ${m.birthday})
- **Day Sign:** ${m.sign.daySign.english} (${m.sign.daySign.yucatec} / ${m.sign.daySign.kiche})
- **Galactic Tone:** ${m.sign.tone.number} (${m.sign.tone.english} / ${m.sign.tone.name})
- **Trecana Sign:** ${m.sign.trecena.english} (${m.sign.trecena.yucatec} / ${m.sign.trecena.kiche}), position ${m.sign.trecena.position}`;
}).join("\n\n")}

## Required Analysis Sections

Please provide a comprehensive Mayan zodiac compatibility analysis with the following sections:

### **Individual Profiles**
For each person, provide a detailed Mayan interpretation based on their signs:
- **Day Sign meaning**: What this day sign reveals about their core personality, strengths, and life path
- **Galactic Tone influence**: How their galactic tone shapes their approach to life, relationships, and challenges
- **Trecana Sign impact**: What their trecana sign adds to their character, motivations, and spiritual journey
- **Overall Mayan profile**: A synthesis of how these three elements combine to create their unique energetic signature

### **Compatibility Overview**
A general assessment of how these Mayan signs interact and the overall energetic fit.

### **Communication & Emotional Dynamics**
How these signs communicate, express emotions, and connect on an emotional level. Consider the galactic tones and trecana signs.

### **Strengths & Natural Harmony**
What naturally works well between these signs. Highlight complementary energies and shared values.

### **Challenges & Friction Points**
Potential conflicts, misunderstandings, or areas where these energies clash. Be specific about how the day signs, tones, or trecanas create tension.

### **Growth Opportunities**
How each person can evolve and grow through this relationship. What can they learn from each other's Mayan profiles?

### **Long-Term Outlook**
The potential for lasting connection and how this relationship may develop over time. Consider the deeper spiritual lessons.

### **Summary**
A concise 2-3 sentence takeaway that captures the essence of this compatibility.

**Important:** Weave the specific Mayan elements (day signs, galactic tones, trecana signs) throughout your analysis. Reference them explicitly when explaining compatibility factors.`;

  return prompt;
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: PKG.name,
    version: PKG.version,
  });

  server.registerTool(
    "get_mayan_sign",
    {
      description: "Get the Mayan zodiac sign for a given birthday.",
      inputSchema: { birthday: z.string() },
    },
    async ({ birthday }) => {
      try {
        const sign = calculateMayanSignFromBirthday(birthday);
        return {
          content: [
            {
              type: "text" as const,
              text: JSON.stringify(sign, null, 2),
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
      description: "Analyze the Mayan zodiac relationship compatibility between two people. Fetches both Mayan signs and returns a complete analysis prompt that the LLM uses to generate the relationship reading. Supports different relationship contexts (romantic, friendship, colleagues, family, business, classmates, general).",
      inputSchema: {
        birthday1: z.string(),
        gender1: z.enum(["male", "female"]),
        birthday2: z.string(),
        gender2: z.enum(["male", "female"]),
        analysis_type: z.enum(analysisTypes).optional().default("romantic"),
      },
    },
    async ({ birthday1, gender1, birthday2, gender2, analysis_type }) => {
      try {
        const sign1 = calculateMayanSignFromBirthday(birthday1);
        const sign2 = calculateMayanSignFromBirthday(birthday2);

        const members = [
          { label: formatGender(gender1), birthday: birthday1, sign: sign1 },
          { label: formatGender(gender2), birthday: birthday2, sign: sign2 },
        ];

        const prompt = buildRelationshipPrompt(analysis_type, members, false);

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
      description: "Analyze the Mayan zodiac relationship compatibility within a group of 3 to 10 people. Fetches all Mayan signs and returns a complete analysis prompt for group dynamics. Supports different group contexts (romantic, friendship, colleagues, family, business, classmates, general).",
      inputSchema: {
        people: z.array(
          z.object({
            birthday: z.string(),
            gender: z.enum(["male", "female"]),
          })
        ).min(3).max(MAX_GROUP_SIZE),
        analysis_type: z.enum(analysisTypes).optional().default("family"),
      },
    },
    async ({ people, analysis_type }) => {
      try {
        const signs = people.map((p) => calculateMayanSignFromBirthday(p.birthday));

        const members = people.map((p, i) => ({
          label: `${formatGender(p.gender)} #${i + 1}`,
          birthday: p.birthday,
          sign: signs[i],
        }));

        const prompt = buildRelationshipPrompt(analysis_type, members, true);

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
