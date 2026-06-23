import { describe, expect, it } from "bun:test";
import { formatGender, getTypeLens, buildRelationshipPrompt } from "./server";

describe("formatGender", () => {
  it("capitalizes first letter and lowercases rest", () => {
    expect(formatGender("male")).toBe("Male");
    expect(formatGender("female")).toBe("Female");
    expect(formatGender("MALE")).toBe("Male");
    expect(formatGender("FEMALE")).toBe("Female");
  });
});

describe("getTypeLens", () => {
  it("returns romantic lens", () => {
    const lens = getTypeLens("romantic");
    expect(lens).toContain("romantic compatibility reading");
    expect(lens).toContain("intimacy");
  });

  it("returns friendship lens", () => {
    const lens = getTypeLens("friendship");
    expect(lens).toContain("friendship compatibility reading");
    expect(lens).toContain("loyalty");
  });

  it("returns colleagues lens", () => {
    const lens = getTypeLens("colleagues");
    expect(lens).toContain("workplace colleagues compatibility reading");
    expect(lens).toContain("collaboration");
  });

  it("returns family lens", () => {
    const lens = getTypeLens("family");
    expect(lens).toContain("family relationship compatibility reading");
    expect(lens).toContain("familial bonds");
  });

  it("returns business lens", () => {
    const lens = getTypeLens("business");
    expect(lens).toContain("business partnership compatibility reading");
    expect(lens).toContain("complementary skills");
  });

  it("returns classmates lens", () => {
    const lens = getTypeLens("classmates");
    expect(lens).toContain("classmates/learning compatibility reading");
    expect(lens).toContain("learning styles");
  });

  it("returns general lens", () => {
    const lens = getTypeLens("general");
    expect(lens).toContain("general compatibility reading");
    expect(lens).toContain("balanced overview");
  });

  it("falls back to general for unknown type", () => {
    const lens = getTypeLens("unknown");
    expect(lens).toContain("general compatibility reading");
  });
});

describe("buildRelationshipPrompt", () => {
  const mockSign = {
    daySign: { index: 7, yucatec: "Manik", kiche: "Kej", english: "Deer" },
    tone: { number: 13, name: "Oxlajuj", english: "Cosmic" },
    trecena: { index: 15, yucatec: "Men", kiche: "Tz'ikin", english: "Eagle", position: 13 },
  };

  const mockSign2 = {
    daySign: { index: 15, yucatec: "Men", kiche: "Tz'ikin", english: "Eagle" },
    tone: { number: 6, name: "Waqib'", english: "Rhythmic" },
    trecena: { index: 10, yucatec: "Ok", kiche: "Tz'i'", english: "Dog", position: 6 },
  };

  it("builds relationship prompt with correct structure", () => {
    const members = [
      { label: "Male", birthday: "19900101", sign: mockSign },
      { label: "Female", birthday: "19920515", sign: mockSign2 },
    ];

    const prompt = buildRelationshipPrompt("romantic", members, false);

    expect(prompt).toContain("# Mayan Zodiac Relationship Compatibility Analysis");
    expect(prompt).toContain("**Analysis Type:** Romantic");
    expect(prompt).toContain("romantic compatibility reading");
    expect(prompt).toContain("**Male** (born 19900101)");
    expect(prompt).toContain("**Female** (born 19920515)");
    expect(prompt).toContain("**Day Sign:** Deer (Manik / Kej)");
    expect(prompt).toContain("**Galactic Tone:** 13 (Cosmic / Oxlajuj)");
    expect(prompt).toContain("**Trecana Sign:** Eagle (Men / Tz'ikin), position 13");
    expect(prompt).toContain("**Day Sign:** Eagle (Men / Tz'ikin)");
    expect(prompt).toContain("### **Individual Profiles**");
    expect(prompt).toContain("### **Compatibility Overview**");
    expect(prompt).toContain("### **Summary**");
  });

  it("builds group prompt with correct structure", () => {
    const members = [
      { label: "Male #1", birthday: "19900101", sign: mockSign },
      { label: "Female #2", birthday: "19920515", sign: mockSign2 },
      { label: "Male #3", birthday: "19950808", sign: mockSign },
    ];

    const prompt = buildRelationshipPrompt("family", members, true);

    expect(prompt).toContain("# Mayan Zodiac Group Compatibility Analysis");
    expect(prompt).toContain("**Analysis Type:** Family");
    expect(prompt).toContain("family relationship compatibility reading");
    expect(prompt).toContain("**Male #1** (born 19900101)");
    expect(prompt).toContain("**Female #2** (born 19920515)");
    expect(prompt).toContain("**Male #3** (born 19950808)");
  });

  it("includes all required analysis sections", () => {
    const members = [
      { label: "Male", birthday: "19900101", sign: mockSign },
      { label: "Female", birthday: "19920515", sign: mockSign2 },
    ];

    const prompt = buildRelationshipPrompt("general", members, false);

    expect(prompt).toContain("### **Individual Profiles**");
    expect(prompt).toContain("### **Compatibility Overview**");
    expect(prompt).toContain("### **Communication & Emotional Dynamics**");
    expect(prompt).toContain("### **Strengths & Natural Harmony**");
    expect(prompt).toContain("### **Challenges & Friction Points**");
    expect(prompt).toContain("### **Growth Opportunities**");
    expect(prompt).toContain("### **Long-Term Outlook**");
    expect(prompt).toContain("### **Summary**");
  });

  it("uses correct lens for each analysis type", () => {
    const members = [
      { label: "Male", birthday: "19900101", sign: mockSign },
      { label: "Female", birthday: "19920515", sign: mockSign2 },
    ];

    const romanticPrompt = buildRelationshipPrompt("romantic", members, false);
    expect(romanticPrompt).toContain("romantic compatibility reading");

    const businessPrompt = buildRelationshipPrompt("business", members, false);
    expect(businessPrompt).toContain("business partnership compatibility reading");

    const classmatesPrompt = buildRelationshipPrompt("classmates", members, false);
    expect(classmatesPrompt).toContain("classmates/learning compatibility reading");
  });
});
