import { describe, it, expect } from "vitest";
import en from "../src/i18n/en.json";
import es from "../src/i18n/es.json";

// Detect if running with example/template data vs real personal data
const isExampleData = en.experience.jobs.length <= 1;

describe("i18n Translation Files", () => {
  describe("Structure parity", () => {
    it("should have the same top-level keys in en and es", () => {
      const enKeys = Object.keys(en).sort();
      const esKeys = Object.keys(es).sort();
      expect(enKeys).toEqual(esKeys);
    });

    it("should have the same nav keys", () => {
      expect(Object.keys(en.nav).sort()).toEqual(Object.keys(es.nav).sort());
    });

    it("should have the same hero keys", () => {
      expect(Object.keys(en.hero).sort()).toEqual(Object.keys(es.hero).sort());
    });

    it("should have the same about keys", () => {
      expect(Object.keys(en.about).sort()).toEqual(
        Object.keys(es.about).sort(),
      );
    });

    it("should have the same contact form keys", () => {
      expect(Object.keys(en.contact.form).sort()).toEqual(
        Object.keys(es.contact.form).sort(),
      );
    });

    it("should have the same number of experience jobs", () => {
      expect(en.experience.jobs.length).toBe(es.experience.jobs.length);
    });

    it("should have the same number of skill categories", () => {
      expect(en.skills.categories.length).toBe(es.skills.categories.length);
    });

    it("should have the same number of summary items", () => {
      expect(en.summary.length).toBe(es.summary.length);
    });
  });

  describe("Language tags", () => {
    it('en.json should have lang "en"', () => {
      expect(en.lang).toBe("en");
    });

    it('es.json should have lang "es"', () => {
      expect(es.lang).toBe("es");
    });

    it('en.json switchLang should be "ES"', () => {
      expect(en.switchLang).toBe("ES");
    });

    it('es.json switchLang should be "EN"', () => {
      expect(es.switchLang).toBe("EN");
    });
  });

  describe("Required content (generic)", () => {
    it("should have non-empty meta title in both languages", () => {
      expect(en.meta.title.length).toBeGreaterThan(5);
      expect(es.meta.title.length).toBeGreaterThan(5);
    });

    it("should have non-empty meta description in both languages", () => {
      expect(en.meta.description.length).toBeGreaterThan(10);
      expect(es.meta.description.length).toBeGreaterThan(10);
    });

    it("should have at least 1 experience job", () => {
      expect(en.experience.jobs.length).toBeGreaterThanOrEqual(1);
      expect(es.experience.jobs.length).toBeGreaterThanOrEqual(1);
    });

    it("should have marquee items for hero animation", () => {
      expect(en.hero.marquee.length).toBeGreaterThanOrEqual(3);
      expect(es.hero.marquee.length).toBeGreaterThanOrEqual(3);
    });

    it("all jobs should have sequential numbers", () => {
      en.experience.jobs.forEach((job: any, i: number) => {
        expect(job.number).toBe(String(i + 1).padStart(2, "0"));
      });
      es.experience.jobs.forEach((job: any, i: number) => {
        expect(job.number).toBe(String(i + 1).padStart(2, "0"));
      });
    });
  });

  describe("Skill items have workplace data", () => {
    for (const category of en.skills.categories) {
      for (const item of category.items) {
        it(`EN: "${item.name}" should have workplaces array`, () => {
          expect(Array.isArray(item.workplaces)).toBe(true);
          expect(item.workplaces.length).toBeGreaterThan(0);
        });

        it(`EN: "${item.name}" should have years string`, () => {
          expect(typeof item.years).toBe("string");
          expect(item.years.length).toBeGreaterThan(0);
        });
      }
    }

    for (const category of es.skills.categories) {
      for (const item of category.items) {
        it(`ES: "${item.name}" should have workplaces array`, () => {
          expect(Array.isArray(item.workplaces)).toBe(true);
          expect(item.workplaces.length).toBeGreaterThan(0);
        });

        it(`ES: "${item.name}" should have years string`, () => {
          expect(typeof item.years).toBe("string");
          expect(item.years.length).toBeGreaterThan(0);
        });
      }
    }
  });

  // Tests that only run with real personal data (not example templates)
  describe.skipIf(isExampleData)("Personal data validation", () => {
    it("should have at least 7 experience jobs", () => {
      expect(en.experience.jobs.length).toBeGreaterThanOrEqual(7);
      expect(es.experience.jobs.length).toBeGreaterThanOrEqual(7);
    });

    it("should have BLOSSOM as the first job", () => {
      expect(en.experience.jobs[0].company).toBe("BLOSSOM");
      expect(es.experience.jobs[0].company).toBe("BLOSSOM");
    });

    it("should have INMOV - AX MARKETING as the second job", () => {
      expect(en.experience.jobs[1].company).toBe("INMOV - AX MARKETING");
      expect(es.experience.jobs[1].company).toBe("INMOV - AX MARKETING");
    });

    it("should have SENA INSTITUTE as the third job", () => {
      expect(en.experience.jobs[2].company).toBe("SENA INSTITUTE");
      expect(es.experience.jobs[2].company).toBe("SENA INSTITUTE");
    });

    it("SENA INSTITUTE stack should include Laravel, Blade, React", () => {
      const senaEn = en.experience.jobs[2];
      const senaEs = es.experience.jobs[2];
      for (const tech of ["Laravel", "Blade", "React"]) {
        expect(senaEn.stack).toContain(tech);
        expect(senaEs.stack).toContain(tech);
      }
    });

    it("should have marquee items > 5 for hero animation", () => {
      expect(en.hero.marquee.length).toBeGreaterThan(5);
      expect(es.hero.marquee.length).toBeGreaterThan(5);
    });

    it("meta description should be > 50 chars", () => {
      expect(en.meta.description.length).toBeGreaterThan(50);
      expect(es.meta.description.length).toBeGreaterThan(50);
    });
  });

  describe.skipIf(isExampleData)("Skill categories contain PHPUnit and Jest", () => {
    const enSkillNames = en.skills.categories.flatMap((c: any) =>
      c.items.map((i: any) => i.name),
    );
    const esSkillNames = es.skills.categories.flatMap((c: any) =>
      c.items.map((i: any) => i.name),
    );

    it("EN skills should include PHPUnit", () => {
      expect(enSkillNames).toContain("PHPUnit");
    });

    it("EN skills should include Jest", () => {
      expect(enSkillNames).toContain("Jest");
    });

    it("ES skills should include PHPUnit", () => {
      expect(esSkillNames).toContain("PHPUnit");
    });

    it("ES skills should include Jest", () => {
      expect(esSkillNames).toContain("Jest");
    });
  });
});
