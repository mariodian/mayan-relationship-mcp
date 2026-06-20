import { describe, expect, it } from "bun:test";
import { validateBirthday } from "./client";

describe("validateBirthday", () => {
  describe("YYYYMMDD format", () => {
    it("accepts valid YYYYMMDD", () => {
      expect(validateBirthday("19900101")).toBe("19900101");
      expect(validateBirthday("20001231")).toBe("20001231");
      expect(validateBirthday("19850615")).toBe("19850615");
    });

    it("rejects invalid YYYYMMDD", () => {
      expect(() => validateBirthday("19901301")).toThrow();
      expect(() => validateBirthday("19900132")).toThrow();
      expect(() => validateBirthday("19900229")).toThrow();
    });

    it("accepts leap year Feb 29", () => {
      expect(validateBirthday("20000229")).toBe("20000229");
      expect(validateBirthday("20240229")).toBe("20240229");
    });

    it("rejects non-leap year Feb 29", () => {
      expect(() => validateBirthday("19000229")).toThrow();
      expect(() => validateBirthday("20010229")).toThrow();
    });
  });

  describe("ISO format (YYYY-MM-DD)", () => {
    it("accepts valid ISO dates", () => {
      expect(validateBirthday("1990-01-01")).toBe("19900101");
      expect(validateBirthday("2000-12-31")).toBe("20001231");
    });

    it("rejects invalid ISO dates", () => {
      expect(() => validateBirthday("1990-13-01")).toThrow();
      expect(() => validateBirthday("1990-01-32")).toThrow();
    });
  });

  describe("US slash format (MM/DD/YYYY)", () => {
    it("accepts valid US dates", () => {
      expect(validateBirthday("01/01/1990")).toBe("19900101");
      expect(validateBirthday("12/31/2000")).toBe("20001231");
      expect(validateBirthday("1/1/1990")).toBe("19900101");
    });

    it("rejects invalid US dates", () => {
      expect(() => validateBirthday("13/01/1990")).toThrow();
      expect(() => validateBirthday("01/32/1990")).toThrow();
    });
  });

  describe("Long month format (Month Day, Year)", () => {
    it("accepts full month names", () => {
      expect(validateBirthday("January 1, 1990")).toBe("19900101");
      expect(validateBirthday("February 28, 2000")).toBe("20000228");
      expect(validateBirthday("December 31, 1985")).toBe("19851231");
    });

    it("accepts abbreviated month names", () => {
      expect(validateBirthday("Jan 1, 1990")).toBe("19900101");
      expect(validateBirthday("Feb 28, 2000")).toBe("20000228");
      expect(validateBirthday("Dec 31, 1985")).toBe("19851231");
    });

    it("accepts without comma", () => {
      expect(validateBirthday("January 1 1990")).toBe("19900101");
    });

    it("is case-insensitive", () => {
      expect(validateBirthday("january 1, 1990")).toBe("19900101");
      expect(validateBirthday("JANUARY 1, 1990")).toBe("19900101");
    });

    it("accepts sept abbreviation", () => {
      expect(validateBirthday("Sept 15, 1990")).toBe("19900915");
    });
  });

  describe("Day-month format (Day Month Year)", () => {
    it("accepts valid day-month-year dates", () => {
      expect(validateBirthday("1 January 1990")).toBe("19900101");
      expect(validateBirthday("31 December 1985")).toBe("19851231");
    });

    it("accepts abbreviated month names", () => {
      expect(validateBirthday("1 Jan 1990")).toBe("19900101");
      expect(validateBirthday("15 Sept 2000")).toBe("20000915");
    });
  });

  describe("invalid formats", () => {
    it("rejects empty string", () => {
      expect(() => validateBirthday("")).toThrow();
    });

    it("rejects random text", () => {
      expect(() => validateBirthday("not a date")).toThrow();
    });

    it("rejects partial dates", () => {
      expect(() => validateBirthday("1990")).toThrow();
      expect(() => validateBirthday("1990-01")).toThrow();
    });
  });
});
