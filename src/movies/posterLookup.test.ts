import { describe, expect, it } from "vitest";
import { parseTitle, pickPoster } from "./posterLookup";

describe("parseTitle", () => {
  it("splits off a trailing year", () => {
    expect(parseTitle(" Dune (1984) ")).toEqual({
      query: "Dune",
      year: "1984",
    });
  });

  it("keeps titles without a year as they are", () => {
    expect(parseTitle("Blade Runner 2049")).toEqual({
      query: "Blade Runner 2049",
    });
  });
});

describe("pickPoster", () => {
  const url = (path: string) => `https://image.tmdb.org/t/p/w185${path}`;

  it("prefers the most popular exact title match", () => {
    const results = [
      { title: "Toy Story 5", poster_path: "/ts5.jpg", popularity: 90 },
      { title: "Toy Story", poster_path: "/old.jpg", popularity: 5 },
      { title: "Toy Story", poster_path: "/ts.jpg", popularity: 50 },
    ];
    expect(pickPoster("toy story", results)).toBe(url("/ts.jpg"));
  });

  it("matches the original title too", () => {
    const results = [
      { title: "Something", poster_path: "/a.jpg" },
      {
        title: "Ziemlich beste Freunde",
        original_title: "Intouchables",
        poster_path: "/b.jpg",
      },
    ];
    expect(pickPoster("Intouchables", results)).toBe(url("/b.jpg"));
  });

  it("falls back to the first result with a poster", () => {
    const results = [
      { title: "Der Pate", poster_path: null },
      { title: "Der Pate 2", poster_path: "/p2.jpg" },
    ];
    expect(pickPoster("pate", results)).toBe(url("/p2.jpg"));
  });

  it("returns null when nothing has a poster", () => {
    expect(pickPoster("x", [{ title: "x", poster_path: null }])).toBeNull();
  });
});
