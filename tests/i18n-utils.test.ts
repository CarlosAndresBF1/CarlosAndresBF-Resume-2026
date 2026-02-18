import { describe, it, expect } from "vitest";
import {
  languages,
  defaultLang,
  getLangFromUrl,
  useTranslations,
  getLocalizedPath,
  getAlternateLang,
} from "../src/i18n/index.ts";

describe("i18n Utility Functions", () => {
  describe("languages", () => {
    it("should export en and es languages", () => {
      expect(languages).toHaveProperty("en");
      expect(languages).toHaveProperty("es");
    });
  });

  describe("defaultLang", () => {
    it('should default to "es"', () => {
      expect(defaultLang).toBe("es");
    });
  });

  describe("getLangFromUrl", () => {
    it("should extract 'en' from /en path", () => {
      const url = new URL("http://localhost/en");
      expect(getLangFromUrl(url)).toBe("en");
    });

    it("should extract 'es' from /es path", () => {
      const url = new URL("http://localhost/es");
      expect(getLangFromUrl(url)).toBe("es");
    });

    it("should extract 'en' from /en/something path", () => {
      const url = new URL("http://localhost/en/something");
      expect(getLangFromUrl(url)).toBe("en");
    });

    it("should return defaultLang for unknown language", () => {
      const url = new URL("http://localhost/fr");
      expect(getLangFromUrl(url)).toBe(defaultLang);
    });

    it("should return defaultLang for root path", () => {
      const url = new URL("http://localhost/");
      expect(getLangFromUrl(url)).toBe(defaultLang);
    });
  });

  describe("useTranslations", () => {
    it("should return English translations", () => {
      const t = useTranslations("en");
      expect(t.lang).toBe("en");
      expect(t.nav.home).toBe("Home");
    });

    it("should return Spanish translations", () => {
      const t = useTranslations("es");
      expect(t.lang).toBe("es");
      expect(t.nav.home).toBe("Inicio");
    });
  });

  describe("getLocalizedPath", () => {
    it("should generate /en for en with no path", () => {
      expect(getLocalizedPath("en")).toBe("/en");
    });

    it("should generate /es for es with no path", () => {
      expect(getLocalizedPath("es")).toBe("/es");
    });

    it("should append path segment", () => {
      expect(getLocalizedPath("en", "about")).toBe("/en/about");
    });
  });

  describe("getAlternateLang", () => {
    it('should return "es" for "en"', () => {
      expect(getAlternateLang("en")).toBe("es");
    });

    it('should return "en" for "es"', () => {
      expect(getAlternateLang("es")).toBe("en");
    });
  });
});
