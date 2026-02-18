import { describe, it, expect } from "vitest";
import en from "../src/i18n/en.json";
import es from "../src/i18n/es.json";

// Detect if running with example/template data vs real personal data
const isExampleData = en.experience.jobs.length <= 1;

describe("SEO Content Validation", () => {
  describe("Meta titles", () => {
    it("EN title should be under 80 characters (ideal for search)", () => {
      expect(en.meta.title.length).toBeLessThanOrEqual(80);
    });

    it("ES title should be under 80 characters (ideal for search)", () => {
      expect(es.meta.title.length).toBeLessThanOrEqual(80);
    });

    it("titles should be non-empty", () => {
      expect(en.meta.title.length).toBeGreaterThan(0);
      expect(es.meta.title.length).toBeGreaterThan(0);
    });
  });

  describe.skipIf(isExampleData)("Meta titles (personal)", () => {
    it("EN title should contain the person name", () => {
      expect(en.meta.title).toContain("Carlos");
    });

    it("ES title should contain the person name", () => {
      expect(es.meta.title).toContain("Carlos");
    });
  });

  describe("Meta descriptions", () => {
    it("descriptions should be non-empty", () => {
      expect(en.meta.description.length).toBeGreaterThan(0);
      expect(es.meta.description.length).toBeGreaterThan(0);
    });

    it("descriptions should not exceed 200 characters", () => {
      expect(en.meta.description.length).toBeLessThanOrEqual(200);
      expect(es.meta.description.length).toBeLessThanOrEqual(200);
    });
  });

  describe.skipIf(isExampleData)("Meta descriptions (personal)", () => {
    it("EN description should be between 50 and 200 characters", () => {
      expect(en.meta.description.length).toBeGreaterThanOrEqual(50);
      expect(en.meta.description.length).toBeLessThanOrEqual(200);
    });

    it("ES description should be between 50 and 200 characters", () => {
      expect(es.meta.description.length).toBeGreaterThanOrEqual(50);
      expect(es.meta.description.length).toBeLessThanOrEqual(200);
    });

    it("EN description should include relevant keywords", () => {
      const desc = en.meta.description.toLowerCase();
      expect(
        desc.includes("engineer") ||
          desc.includes("developer") ||
          desc.includes("software"),
      ).toBe(true);
    });

    it("ES description should include relevant keywords", () => {
      const desc = es.meta.description.toLowerCase();
      expect(
        desc.includes("ingeniero") ||
          desc.includes("desarrollador") ||
          desc.includes("software"),
      ).toBe(true);
    });
  });

  describe("Experience jobs have required SEO-friendly fields", () => {
    for (const job of en.experience.jobs) {
      it(`EN job "${job.company}" should have stack array`, () => {
        expect(Array.isArray(job.stack)).toBe(true);
        expect(job.stack.length).toBeGreaterThan(0);
      });

      it(`EN job "${job.company}" should have a period`, () => {
        expect(job.period.length).toBeGreaterThan(0);
      });
    }
  });

  describe("Hero section", () => {
    it("EN hero should have a non-empty role", () => {
      expect(en.hero.role.length).toBeGreaterThan(5);
    });

    it("ES hero should have a non-empty role", () => {
      expect(es.hero.role.length).toBeGreaterThan(5);
    });

    it("EN hero should have a tagline", () => {
      expect(en.hero.tagline.length).toBeGreaterThan(10);
    });

    it("ES hero should have a tagline", () => {
      expect(es.hero.tagline.length).toBeGreaterThan(10);
    });

    it("marquee should have items for visual effect", () => {
      expect(en.hero.marquee.length).toBeGreaterThanOrEqual(3);
      expect(es.hero.marquee.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe.skipIf(isExampleData)("Hero section (personal)", () => {
    it("marquee should have at least 10 items", () => {
      expect(en.hero.marquee.length).toBeGreaterThanOrEqual(10);
      expect(es.hero.marquee.length).toBeGreaterThanOrEqual(10);
    });
  });
});
