import { parse, type HTMLElement } from "node-html-parser";

export interface MayanSign {
  day_sign: string;
  tone: string;
  trecana_sign: string;
}

function extractHeadingAfterId(root: ReturnType<typeof parse>, sectionId: string): string {
  const sectionElement = root.querySelector(`#${sectionId}`);
  if (!sectionElement) return "";

  let current: HTMLElement | null = sectionElement;
  while (current) {
    const headings = current.querySelectorAll(".report-single_heading");
    for (const heading of headings) {
      if (heading.querySelector("img")) {
        return heading.querySelector("h2")?.text.trim() ?? "";
      }
    }
    current = current.nextElementSibling as HTMLElement | null;
  }

  return "";
}

export function parseMayanSign(html: string): MayanSign {
  const root = parse(html);

  return {
    day_sign: extractHeadingAfterId(root, "day-sign"),
    tone: extractHeadingAfterId(root, "tone"),
    trecana_sign: extractHeadingAfterId(root, "tercana"),
  };
}
