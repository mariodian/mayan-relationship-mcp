import { describe, expect, it } from "bun:test";
import { parseMayanSign } from "./parser";

describe("parseMayanSign", () => {
  it("extracts day_sign from HTML", () => {
    const html = `
      <div id="day-sign" class="report-single_main-heading">
        <h2>Your Day Sign</h2>
      </div>
      <div class="report-single">
        <div class="report-single_heading">
          <img src="test.jpg">
          <h2>Dog</h2>
        </div>
      </div>
    `;
    const result = parseMayanSign(html);
    expect(result.day_sign).toBe("Dog");
  });

  it("extracts tone from HTML", () => {
    const html = `
      <div id="tone" class="report-single_main-heading">
        <h2>Your Galactic Tone</h2>
      </div>
      <div class="report-single">
        <div class="report-single_heading">
          <img src="test.jpg">
          <h2>12</h2>
        </div>
      </div>
    `;
    const result = parseMayanSign(html);
    expect(result.tone).toBe("12");
  });

  it("extracts trecana_sign from HTML", () => {
    const html = `
      <div id="tercana" class="report-single_main-heading">
        <h2>Your Trecana</h2>
      </div>
      <div class="report-single">
        <div class="report-single_heading">
          <img src="test.jpg">
          <h2>Storm</h2>
        </div>
      </div>
    `;
    const result = parseMayanSign(html);
    expect(result.trecana_sign).toBe("Storm");
  });

  it("extracts all three fields from complete HTML", () => {
    const html = `
      <div id="day-sign" class="report-single_main-heading">
        <h2>Your Day Sign</h2>
      </div>
      <div class="report-single">
        <div class="report-single_heading">
          <img src="dog.jpg">
          <h2>Dog</h2>
        </div>
      </div>
      <div id="tone" class="report-single_main-heading">
        <h2>Your Galactic Tone</h2>
      </div>
      <div class="report-single">
        <div class="report-single_heading">
          <img src="tone.jpg">
          <h2>12</h2>
        </div>
      </div>
      <div id="tercana" class="report-single_main-heading">
        <h2>Your Trecana</h2>
      </div>
      <div class="report-single">
        <div class="report-single_heading">
          <img src="storm.jpg">
          <h2>Storm</h2>
        </div>
      </div>
    `;
    const result = parseMayanSign(html);
    expect(result.day_sign).toBe("Dog");
    expect(result.tone).toBe("12");
    expect(result.trecana_sign).toBe("Storm");
  });

  it("returns empty strings when sections are missing", () => {
    const html = "<html><body></body></html>";
    const result = parseMayanSign(html);
    expect(result.day_sign).toBe("");
    expect(result.tone).toBe("");
    expect(result.trecana_sign).toBe("");
  });

  it("ignores headings without images", () => {
    const html = `
      <div id="day-sign" class="report-single_main-heading">
        <h2>Your Day Sign</h2>
      </div>
      <div class="report-single">
        <div class="report-single_heading">
          <h2>Wrong</h2>
        </div>
        <div class="report-single_heading">
          <img src="dog.jpg">
          <h2>Dog</h2>
        </div>
      </div>
    `;
    const result = parseMayanSign(html);
    expect(result.day_sign).toBe("Dog");
  });
});
