import { describe, expect, it } from "bun:test";
import { calculateMayanSign, calculateMayanSignFromBirthday } from "./tzolkin";

describe("calculateMayanSign", () => {
  it("returns correct signs for 1989-01-03", () => {
    const result = calculateMayanSign(1989, 1, 3);

    expect(result.tone.number).toBe(13);
    expect(result.tone.name).toBe("Oxlajuj");
    expect(result.tone.english).toBe("Cosmic");

    expect(result.daySign.index).toBe(7);
    expect(result.daySign.yucatec).toBe("Manik");
    expect(result.daySign.kiche).toBe("Kej");
    expect(result.daySign.english).toBe("Deer");

    expect(result.trecena.index).toBe(15);
    expect(result.trecena.yucatec).toBe("Men");
    expect(result.trecena.kiche).toBe("Tz'ikin");
    expect(result.trecena.english).toBe("Eagle");
    expect(result.trecena.position).toBe(13);
  });

  it("returns correct signs for 1969-07-20 (Apollo 11)", () => {
    const result = calculateMayanSign(1969, 7, 20);

    expect(result.tone.number).toBe(4);
    expect(result.daySign.index).toBe(20);
    expect(result.daySign.yucatec).toBe("Ahau");
    expect(result.daySign.kiche).toBe("Ajpu");
    expect(result.daySign.english).toBe("Sun / Lord / Flower");

    expect(result.trecena.index).toBe(17);
    expect(result.trecena.yucatec).toBe("Kaban");
    expect(result.trecena.kiche).toBe("No'j");
    expect(result.trecena.english).toBe("Earth / Earthquake");
    expect(result.trecena.position).toBe(4);
  });

  it("returns the epoch itself (3114-08-11) as 4 Ahau", () => {
    // GMT correlation epoch: JDN 584283 = 4 Ahau, trecena starts with Ahau
    // Using -3113 for 3114 BCE (astronomical year numbering)
    const result = calculateMayanSign(-3113, 8, 11);

    expect(result.tone.number).toBe(4);
    expect(result.daySign.index).toBe(20);
    expect(result.daySign.yucatec).toBe("Ahau");
    expect(result.trecena.index).toBe(17);
    expect(result.trecena.position).toBe(4);
  });

  it("handles dates before the epoch (negative n)", () => {
    // 1900-01-01 - well before epoch, n will be negative
    const result = calculateMayanSign(1900, 1, 1);

    expect(result.tone.number).toBeGreaterThanOrEqual(1);
    expect(result.tone.number).toBeLessThanOrEqual(13);
    expect(result.daySign.index).toBeGreaterThanOrEqual(1);
    expect(result.daySign.index).toBeLessThanOrEqual(20);
    expect(result.trecena.index).toBeGreaterThanOrEqual(1);
    expect(result.trecena.index).toBeLessThanOrEqual(20);
    expect(result.trecena.position).toBe(result.tone.number);
  });

  it("handles leap year date 2000-02-29", () => {
    const result = calculateMayanSign(2000, 2, 29);

    expect(result.tone.number).toBeGreaterThanOrEqual(1);
    expect(result.tone.number).toBeLessThanOrEqual(13);
    expect(result.daySign.index).toBeGreaterThanOrEqual(1);
    expect(result.daySign.index).toBeLessThanOrEqual(20);
  });
});

describe("calculateMayanSignFromBirthday", () => {
  it("accepts YYYYMMDD format", () => {
    const result = calculateMayanSignFromBirthday("19890103");
    expect(result.tone.number).toBe(13);
    expect(result.daySign.index).toBe(7);
  });

  it("accepts ISO format (YYYY-MM-DD)", () => {
    const result = calculateMayanSignFromBirthday("1989-01-03");
    expect(result.tone.number).toBe(13);
    expect(result.daySign.index).toBe(7);
  });

  it("accepts human-readable format", () => {
    const result = calculateMayanSignFromBirthday("January 3, 1989");
    expect(result.tone.number).toBe(13);
    expect(result.daySign.index).toBe(7);
  });

  it("throws on invalid birthday", () => {
    expect(() => calculateMayanSignFromBirthday("not a date")).toThrow();
  });
});
