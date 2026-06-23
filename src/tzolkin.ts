import { validateBirthday } from "./client";

// Day sign names indexed 1..20 — Yucatec / K'iche' / English
const DAY_SIGNS: readonly {
  yucatec: string;
  kiche: string;
  english: string;
}[] = [
  { yucatec: "Imix", kiche: "Imox", english: "Crocodile / Waterlily" },
  { yucatec: "Ik", kiche: "Iq'", english: "Wind" },
  { yucatec: "Akbal", kiche: "Aq'ab'al", english: "Night / House" },
  { yucatec: "Kan", kiche: "K'at", english: "Lizard / Net / Seed" },
  { yucatec: "Chikchan", kiche: "Kan", english: "Serpent" },
  { yucatec: "Kimi", kiche: "Kame", english: "Death" },
  { yucatec: "Manik", kiche: "Kej", english: "Deer" },
  { yucatec: "Lamat", kiche: "Q'anil", english: "Rabbit / Star" },
  { yucatec: "Muluk", kiche: "Toj", english: "Water / Offering" },
  { yucatec: "Ok", kiche: "Tz'i'", english: "Dog" },
  { yucatec: "Chuwen", kiche: "B'atz'", english: "Monkey" },
  { yucatec: "Eb", kiche: "E", english: "Road / Tooth" },
  { yucatec: "Ben", kiche: "Aj", english: "Reed" },
  { yucatec: "Ix", kiche: "I'x", english: "Jaguar" },
  { yucatec: "Men", kiche: "Tz'ikin", english: "Eagle" },
  { yucatec: "Kib", kiche: "Ajmaq", english: "Vulture / Wisdom" },
  { yucatec: "Kaban", kiche: "No'j", english: "Earth / Earthquake" },
  { yucatec: "Etznab", kiche: "Tijax", english: "Flint / Knife" },
  { yucatec: "Kawak", kiche: "Kawoq", english: "Storm / Rain" },
  { yucatec: "Ahau", kiche: "Ajpu", english: "Sun / Lord / Flower" },
] as const;

// Galactic tone names indexed 1..13 — traditional / English
const TONES: readonly { name: string; english: string }[] = [
  { name: "Jun", english: "Magnetic" },
  { name: "Keb'", english: "Lunar" },
  { name: "Oxib'", english: "Electric" },
  { name: "Kajib'", english: "Self-Existing" },
  { name: "Job'", english: "Overtone" },
  { name: "Waqib'", english: "Rhythmic" },
  { name: "Wuqub'", english: "Resonant" },
  { name: "Wajxaqib'", english: "Galactic" },
  { name: "B'elejeb'", english: "Solar" },
  { name: "Lajuj", english: "Planetary" },
  { name: "Junlajuj", english: "Spectral" },
  { name: "Kab'lajuj", english: "Crystal" },
  { name: "Oxlajuj", english: "Cosmic" },
] as const;

// GMT correlation constant: JDN of the Maya creation date (4 Ahau)
const GMT_CORRELATION = 584283;

export interface ToneInfo {
  number: number;
  name: string;
  english: string;
}

export interface DaySignInfo {
  index: number;
  yucatec: string;
  kiche: string;
  english: string;
}

export interface TrecenaInfo {
  index: number;
  yucatec: string;
  kiche: string;
  english: string;
  position: number;
}

export interface MayanProfile {
  tone: ToneInfo;
  daySign: DaySignInfo;
  trecena: TrecenaInfo;
}

function mod(x: number, k: number): number {
  return ((x % k) + k) % k;
}

function gregorianToJdn(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

export function calculateMayanSign(
  year: number,
  month: number,
  day: number,
): MayanProfile {
  const jdn = gregorianToJdn(year, month, day);
  const n = jdn - GMT_CORRELATION;

  // Galactic tone (1..13). Epoch tone is 4, offset by +3.
  const toneNum = mod(n + 3, 13) + 1;
  const toneDef = TONES[toneNum - 1];

  // Day sign index (1..20). Epoch sign is Ahau=20, offset by +19.
  const signIndex = mod(n + 19, 20) + 1;
  const signDef = DAY_SIGNS[signIndex - 1];

  // Trecena: the day sign that starts the current 13-day trecena (paired with tone 1).
  const trecenaStartIndex = mod(signIndex - toneNum, 20) + 1;
  const trecenaDef = DAY_SIGNS[trecenaStartIndex - 1];

  return {
    tone: { number: toneNum, name: toneDef.name, english: toneDef.english },
    daySign: {
      index: signIndex,
      yucatec: signDef.yucatec,
      kiche: signDef.kiche,
      english: signDef.english,
    },
    trecena: {
      index: trecenaStartIndex,
      yucatec: trecenaDef.yucatec,
      kiche: trecenaDef.kiche,
      english: trecenaDef.english,
      position: toneNum,
    },
  };
}

export function calculateMayanSignFromBirthday(birthday: string): MayanProfile {
  const yyyymmdd = validateBirthday(birthday);
  const year = parseInt(yyyymmdd.substring(0, 4));
  const month = parseInt(yyyymmdd.substring(4, 6));
  const day = parseInt(yyyymmdd.substring(6, 8));
  return calculateMayanSign(year, month, day);
}
