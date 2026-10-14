import { describe, expect, it } from "vitest";
import { parseTheme } from "./theme";

describe("parseTheme", () => {
  it("accepts the known themes", () => {
    expect(parseTheme("day")).toBe("day");
    expect(parseTheme("night")).toBe("night");
  });

  it("rejects anything else", () => {
    expect(parseTheme(null)).toBeNull();
    expect(parseTheme("dark")).toBeNull();
  });
});
