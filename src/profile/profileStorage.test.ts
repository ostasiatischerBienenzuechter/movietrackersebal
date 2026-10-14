import { describe, expect, it } from "vitest";
import { parseProfile } from "./profileStorage";

describe("parseProfile", () => {
  it("reads a stored profile", () => {
    expect(parseProfile('{"id":"x","name":"Anna","emoji":"🦊"}')).toEqual({
      id: "x",
      name: "Anna",
      emoji: "🦊",
    });
  });

  it("treats missing or broken data as no profile", () => {
    expect(parseProfile(null)).toBeNull();
    expect(parseProfile("not json")).toBeNull();
    expect(parseProfile('{"id":"x","name":"Anna"}')).toBeNull();
    expect(parseProfile('{"id":"x","name":"","emoji":"🦊"}')).toBeNull();
  });
});
