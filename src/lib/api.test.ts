import { describe, it, expect } from "vitest";
import { constants } from "./constants";
import { getUrl, getApiUrl, formatUrl } from "./api";

describe("Api", () => {
  describe("getUrl function", () => {
    it("should return the correct URL", () => {
      const val = getUrl("login");

      expect(val).toBe(constants.cwa.url + "/login");
    });
    it("should return the correct URL with params", () => {
      const val = getUrl("login/:p1/:p2", { p1: "p1Val", p2: "p2Val" });

      expect(val).toBe(constants.cwa.url + "/login/p1Val/p2Val");
    });
  });

  describe("getApiUrl function", () => {
    it("should return the correct API URL", () => {
      const val = getApiUrl("login");

      expect(val).toBe(constants.routes.api.base + "login");
    });
    it("should return the correct API URL with params", () => {
      const val = getApiUrl("login/:p1/:p2", { p1: "p1Val", p2: "p2Val" });

      expect(val).toBe(constants.routes.api.base + "login/p1Val/p2Val");
    });
  });

  describe("formatUrl function", () => {
    const base = "base/";
    it("should return the correct formatted URL", () => {
      const val = formatUrl(base, "login");

      expect(val).toBe(base + "login");
    });
    it("should return the correct formatted URL with one param (s1)", () => {
      const val = formatUrl(base, "login/:p1", { p1: "p1Val" });

      expect(val).toBe(base + "login/p1Val");
    });
    it("should return the correct formatted URL with multiple params (s1)", () => {
      const val = formatUrl(base, "login/:p1/:p2", { p1: "p1Val", p2: "p2Val" });

      expect(val).toBe(base + "login/p1Val/p2Val");
    });
    it("should return the correct formatted URL with one param (s2)", () => {
      const val = formatUrl(base, "login?p1=:p1", { p1: "p1Val" });

      expect(val).toBe(base + "login?p1=p1Val");
    });
    it("should return the correct formatted URL with multiple params (s2)", () => {
      const val = formatUrl(base, "login?p1=:p1&p2=:p2", { p1: "p1Val", p2: "p2Val" });

      expect(val).toBe(base + "login?p1=p1Val&p2=p2Val");
    });
  });
});
